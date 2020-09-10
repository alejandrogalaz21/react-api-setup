import jsreport from 'jsreport'
import Fee from './../models/fee'
import { mdy } from './../../util/dates'
import Partner from './../models/partner'
import pagination from './../../util/pagination'
import { saveValidation } from './../validation/fee'
import { createMatrix, getDetail } from './../../util/reports'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getFee, getFeeByPartner, getFeeDetail } from './../queries/fee.report'

const select =
  'uuid partner amount date concept discount institution description detail createdAt'
export const populate = {
  path: 'partner',
  populate: [
    { path: 'thumbnail', select: 'path' },
    { path: 'group', select: 'uuid name color' }
  ],
  select: 'uuid name lastName fullName thumbnail group'
}

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await Fee.find(req.filterQuery)
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
      .populate('institution', 'name code')
      .select(select)
      .sort({ updatedAt: -1 })

    if (req.query.page && req.query.size) {
      payload = await pagination(Fee)(req.query)
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
    const result = await Fee.findOne(req.filterQuery)
      .populate(populate)
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
export const create = async (req, res) => {
  try {
    const created_by = req.user._id
    const partner = await Partner.findById(req.body.partner)
    const request = { ...req.body, institution: partner.institution, created_by }

    const validate = await saveValidation(Fee)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const detail = { cause: 'Creación', description: 'Nueva cuota agregada', created_by }
    const payload = await Fee.create({ ...request, detail: [detail] })
    const result = await Fee.findOne(payload).populate(populate).select(select)

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
    const validate = await saveValidation(Fee)(request)
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

    const validate = await saveValidation(Fee)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)

    detail.created_by = updated_by
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await Fee.findOneAndUpdate(query, data, { new: true })

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

    const { active } = await Fee.findOne(query)
    const data = { active: !active, $push: { detail } }
    const result = await Fee.findOneAndUpdate(query, data, { new: true })
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
    const result = await Fee.findOneAndDelete(query)
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
    const result = await Fee.find({ partner: partner._id, ...query })
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
      .select(select)
      .sort({ date: -1 })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const data = await getFee(req.filterQuery, populate, select)
    const columns = [
      { title: 'Socio', value: row => row.partner.fullName },
      { title: 'Cantidad', value: row => row.amount.toFixed(2) },
      { title: 'Fecha de pago', value: row => mdy(row.date) },
      { title: 'Concepto', value: 'concept' },
      { title: 'Descuento', value: row => `${row.discount}%` },
      { title: 'Descripción', value: 'description' }
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
        data: { ...reportData, title: 'Cuotas', type: 'table' }
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
    const data = await getFeeByPartner(req.filterQuery, populate, select)
    const columns = [
      { title: 'Socio', value: row => row.partner.fullName },
      { title: 'Cantidad', value: row => row.amount.toFixed(2) },
      { title: 'Fecha de pago', value: row => mdy(row.date) },
      { title: 'Concepto', value: 'concept' },
      { title: 'Descuento', value: row => `${row.discount}%` },
      { title: 'Descripción', value: 'description' }
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
        data: { ...reportData, title: 'Cuotas', type: 'table' }
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
    const data = await getFeeDetail(req.filterQuery, populate, select)
    const columns = [
      { title: 'Socio', value: row => row.partner.fullName },
      { title: 'Cantidad', value: row => row.amount.toFixed(2) },
      { title: 'Fecha de pago', value: row => mdy(row.date) },
      { title: 'Concepto', value: 'concept' },
      { title: 'Descuento', value: row => `${row.discount}%` },
      { title: 'Descripción', value: 'description' },
      { title: 'Creado', value: row => mdy(row.createdAt) }
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
        data: { reportData, title: 'Cuotas', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
