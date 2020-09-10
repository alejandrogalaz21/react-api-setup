import jsreport from 'jsreport'
import Book from './../models/book'
import BookLocation from './../models/bookLocation'
import { mdy } from './../../util/dates'
import pagination from './../../util/pagination'
import { saveValidation } from './../validation/book'
import { createMatrix, getDetail } from './../../util/reports'
import { getBook, getBookDetail } from './../queries/book.report'
import { downloadReportAndDelete } from './../../util/bufferReport'

const populate = [
	{ path: 'thumbnail', select: 'path' },
	{
		path: 'bookLocation',
		select: 'institution location',
		populate: [{ path: 'institution', select: 'name' }]
	},
	{ path: 'category', select: 'name' },
	{ path: 'institution', select: 'name code' },
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await Book.find(req.filterQuery)
			.sort({ updatedAt: -1 })
			.populate(populate)
			.populate('detail.created_by', 'name lastName')
			.select('-created_by -updated_by')
			.lean()

		if (req.query.page && req.query.size) {
			payload = await pagination(Book)(req.query)
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
		const result = await Book.findOne(req.filterQuery)
			.populate(populate)
			.populate('created_by updated_by', 'name lastName')
			.select('-detail')
			.lean()

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
		const request = { ...req.body, created_by }

		const validate = await saveValidation(Book)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = { cause: 'Creación', description: 'Nuevo libro agregado', created_by }
		const { institution } = await BookLocation.findById(request.bookLocation).lean()
		const data = { ...request, institution, detail: [detail] }
		const payload = await Book.create(data)

		return res.status(200).json(payload)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Validate POST and PUT request before sending those requests
export const validate = async (req, res) => {
	try {
		const request = req.body
		const validate = await saveValidation(Book)(request, request.uuid)
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

		const validate = await saveValidation(Book)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const { institution } = await BookLocation.findById(payload.bookLocation).lean()

		const data = { ...payload, updated_by, institution, $push: { detail } }
		const result = await Book.findOneAndUpdate(query, data, { new: true })

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

		const { active } = await Book.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await Book.findOneAndUpdate(query, data, { new: true })

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
		const result = await Book.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
	try {
		const data = await getBook(req.filterQuery, populate)
		const columns = [
			{ title: 'Titulo', value: 'title' },
			{ title: 'Autor', value: 'author' },
			{ title: 'Ubicación', value: (row) => row.bookLocation.location },
			{ title: 'Sede', value: (row) => row.bookLocation.institution.name },
			{ title: 'Estatus', value: (row) => (row.active ? 'Activo' : 'No activo') },
			{ title: 'Creado', value: (row) => mdy(row.createdAt) }
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
				data: { ...reportData, title: 'Libros', type: 'table' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
	try {
		const data = await getBookDetail(req.filterQuery, populate)
		const columns = [
			{ title: 'Título', value: 'title' },
			{
				title: 'Categoría(s)',
				value: (row) => row.category.map((c) => `${c.name}`).join(',')
			},
			{ title: 'Autor', value: 'author' },
			{ title: 'Creado', value: (row) => mdy(row.createdAt) },
			{ title: 'Estatus', value: (row) => (row.active ? 'Activo' : 'No activo') },
			{ title: 'Sede', value: (row) => row.bookLocation.institution.name },
			{ title: 'Descripción', value: 'description' },
			{ title: 'Ubicación del libro', value: (row) => row.bookLocation.location },
			{
				title: 'Libros',
				value: (row) =>
					row.copies.map((c) => `${c.cant} libros(s) - Editorial: ${c.editorial} ISBN: ${c.isbn}`).join(',')
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
				data: { reportData, title: 'Libro', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
