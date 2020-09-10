import BookLoan from './../models/bookLoan'
import Book from './../models/book'
import Partner from './../models/partner'
import { saveValidation, validationCreate } from './../validation/bookLoan'
import pagination from './../../util/pagination'
import { isEmpty } from '../../util'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import {
  getBookLoan,
  getBookLoanByPartner,
  getBookLoanByDetail
} from '../queries/bookLoan.report'
import { mdy } from '../../util/dates'
import { createMatrix, getDetail } from '../../util/reports'

const populate = {
  path: 'book',
  populate: [
    { path: 'thumbnail', select: 'path' },
    { path: 'category', select: 'name' },
    { path: 'bookLocation', select: 'name institution' }
  ],
  select: 'uuid title author thumbnail copies description isbn bookLocation'
}

const partnerPopulate = {
  path: 'partner',
  populate: [
    { path: 'thumbnail', select: 'path' },
    { path: 'group', select: 'name color' }
  ],
  select: 'uuid id name lastName fullName birthDate shift thumbnail group'
}

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await BookLoan.find(req.filterQuery)
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
      .populate('partner', 'uuid name lastName fullName birthDate shift')
      .populate('institution', 'name code')
      .select(
        'uuid book partner copies returnDate loanDate isbn editorial institution detail'
      )
      .sort({ updatedAt: -1 })

    if (req.query.page && req.query.size) {
      payload = await pagination(BookLoan)(req.query)
    }
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Retrieve a single document in the collection
export const show = async (req, res) => {
  try {
    const result = await BookLoan.findOne(req.filterQuery)
      .populate({
        ...populate,
        select: 'uuid title editorial category author thumbnail copies isbn editorial'
      })
      .populate(partnerPopulate)
      .populate('created_by updated_by', 'name lastName')
      .populate('institution', 'name code')
      .select('-detail')
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Insert a new document into the collection
export const createManual = async (req, res) => {
  try {
    const created_by = req.user._id
    const request = { ...req.body, created_by }
    const { isbn, partnerUuid } = request

    const validate = await saveValidation(BookLoan)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const partner = await Partner.findOne({ uuid: partnerUuid })
    const book = await Book.findOne({
      'copies.isbn': isbn,
      active: true,
      institution: partner.institution
    })
    const copy = book.copies.find(c => c.isbn == isbn)

    const validation = await validationCreate(BookLoan)(
      book,
      copy.cant,
      copy.isbn,
      partner._id
    )
    if (!validation.isValid) return res.status(400).json(validation)

    const bookCopy = { isbn: copy.isbn, editorial: copy.editorial }
    const detail = {
      cause: 'Creación',
      description: 'Nuevo préstamo manual',
      created_by
    }

    const data = {
      ...request,
      institution: partner.institution,
      partner,
      book,
      ...bookCopy,
      detail: [detail]
    }
    const payload = await BookLoan.create(data)
    const result = await BookLoan.findOne(payload)
      .populate(populate)
      .populate(partnerPopulate)

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

// Insert a new document into the collection by QR code scanning (subdoc _id)
export const createAuto = async (req, res) => {
  try {
    const created_by = req.user._id
    const request = { ...req.body, created_by }
    const { id, partnerUuid } = req.body

    const validate = await saveValidation(BookLoan)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const partner = await Partner.findOne({ uuid: partnerUuid })
    const book = await Book.findOne({
      'copies._id': id,
      active: true,
      institution: partner.institution
    })
    const copy = book.copies.find(c => c._id.equals(id))

    const validation = await validationCreate(BookLoan)(
      book,
      copy.cant,
      copy.isbn,
      partner._id
    )
    if (!validation.isValid) return res.status(400).json(validation)

    const bookCopy = { isbn: copy.isbn, editorial: copy.editorial }
    const detail = {
      cause: 'Creación',
      description: 'Nuevo préstamo automático',
      created_by
    }

    const data = {
      ...request,
      partner,
      institution: partner.institution,
      book,
      ...bookCopy,
      detail: [detail]
    }
    const payload = await BookLoan.create(data)
    const result = await BookLoan.findOne(payload)
      .populate(populate)
      .populate(partnerPopulate)

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Validate POST and PUT request before sending those requests
export const validate = async (req, res) => {
  try {
    const request = req.body
    const validate = await saveValidation(BookLoan)(request, request.uuid)
    return res.status(200).json(validate)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Update a document
export const update = async (req, res) => {
  try {
    const updated_by = req.user._id
    let { payload, detail } = req.body
    const query = { uuid: req.params.uuid }

    const validate = await saveValidation(BookLoan)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)

    detail = { ...detail, created_by: updated_by }
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await BookLoan.findOneAndUpdate(query, data, { new: true })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Logical deletion based on the active property
export const toggle = async (req, res) => {
  try {
    const updated_by = req.user._id
    const query = { uuid: req.params.uuid }
    const detail = { ...req.body.detail, created_by: updated_by }

    const { active } = await BookLoan.findOne(query)
    const data = { active: !active, updated_by, $push: { detail } }
    const result = await BookLoan.findOneAndUpdate(query, data, { new: true })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Permanently remove a document
export const destroy = async (req, res) => {
  try {
    const query = { uuid: req.params.uuid }
    const result = await BookLoan.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Retrieve all documents filtered by one partner
export const getByPartner = async (req, res) => {
  try {
    const { institution } = req.filterQuery
    const query = institution ? { institution } : {}

    const partner = await Partner.findOne({ uuid: req.params.partneruuid })
    const result = await BookLoan.find({ partner: partner._id, ...query })
      .populate(populate)
      .populate('partner', 'uuid name lastName fullName')
      .select('uuid book partner isbn copies returnDate loanDate')
      .sort({ updatedAt: -1 })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const data = await getBookLoan(req.filterQuery, populate)
    const columns = [
      { title: 'Libro', value: row => row.book.title },
      { title: 'ISBN', value: row => row.isbn },
      { title: 'Socio', value: row => `${row.partner.name} ${row.partner.lastName}` },
      {
        title: 'Estatus',
        value: row => (row.returnDate ? 'Entregado' : 'Prestado')
      },
      { title: 'Fecha de préstamo', value: row => mdy(row.loanDate) }
    ]

    const reportData = createMatrix(data, columns)

    jsreport
      .render({
        template: {
          name: 'ExportPdf',
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          chrome: {
            marginTop: '100px',
            marginBottom: '80px'
          }
        },
        data: { ...reportData, title: 'Préstamo de libros', type: 'table' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}

// this method download the PDF report .
export const exportPdfReportByPartner = async (req, res) => {
  try {
    const data = await getBookLoanByPartner(req.filterQuery, populate)
    const columns = [
      { title: 'Libro', value: row => row.book.title },
      { title: 'ISBN', value: row => row.isbn },
      { title: 'Socio', value: row => `${row.partner.name} ${row.partner.lastName}` },
      {
        title: 'Estatus',
        value: row => (row.returnDate ? 'Entregado' : 'Prestado')
      },
      { title: 'Fecha de préstamo', value: row => mdy(row.loanDate) }
    ]

    const reportData = createMatrix(data, columns)

    jsreport
      .render({
        template: {
          name: 'ExportPdf',
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          chrome: {
            marginTop: '100px',
            marginBottom: '80px'
          }
        },
        data: { ...reportData, title: 'Préstamo de libros', type: 'table' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
  try {
    const data = await getBookLoanByDetail(req.filterQuery, populate, partnerPopulate)
    const columns = [
      { title: 'Título', value: row => row.book.title },
      { title: 'Autor', value: row => row.book.author },
      { title: 'Editorial', value: 'editorial' },
      {
        title: 'Categoría(s)',
        value: row => row.book.category.map(c => `${c.name}`).join(',')
      },
      { title: 'ISBN', value: 'isbn' },

      { title: 'Nombre del socio', value: row => row.partner.fullName },
      { title: 'Matrícula del socio', value: row => row.partner.id },
      { title: 'Fecha de préstamo', value: row => mdy(row.loanDate) },
      {
        title: 'Fecha de devolución',
        value: row => (row.returnDate ? mdy(row.returnDate) : 'Pendiente')
      }
    ]

    const reportData = getDetail(data, columns)

    jsreport
      .render({
        template: {
          name: 'ExportPdf',
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          chrome: {
            marginTop: '100px',
            marginBottom: '80px'
          }
        },
        data: { reportData, title: 'Préstamos de libro', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
