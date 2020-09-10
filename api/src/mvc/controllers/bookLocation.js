import BookLocation from './../models/bookLocation'
import { saveValidation } from './../validation/bookLocation'
import pagination from './../../util/pagination'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { mdy } from '../../util/dates'
import { createMatrix, getDetail } from '../../util/reports'
import { getBookLocation, getBookLocationDetail } from '../queries/bookLocation.report'

const populate = [{ path: 'institution', select: 'name' }]

const select = 'uuid location active createdAt detail '

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await BookLocation.find(req.filterQuery)
			.sort({ updatedAt: -1 })
			.populate(populate)
			.populate('detail.created_by', 'name lastName')
			.select(select)
			.lean()
		if (req.query.page && req.query.size) {
			payload = await pagination(BookLocation)(req.query)
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
		const result = await BookLocation.findOne(req.filterQuery)
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

		const validate = await saveValidation(BookLocation)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nueva ubicación agregada',
			created_by
		}
		const data = { ...request, detail: [detail] }
		const payload = await BookLocation.create(data)

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
		const validate = await saveValidation(BookLocation)(request, request.uuid)
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
		const { payload, detail } = req.body
		const query = { uuid: req.params.uuid }

		const validate = await saveValidation(BookLocation)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail.created_by = updated_by
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await BookLocation.findOneAndUpdate(query, data, { new: true })

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

		const { active } = await BookLocation.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await BookLocation.findOneAndUpdate(query, data, { new: true })

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
		const result = await BookLocation.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
	try {
		const data = await getBookLocation(req.filterQuery, populate, select)
		const columns = [
			{ title: 'Sede', value: (row) => row.institution.name },
			{ title: 'Ubicación', value: 'location' },
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
				data: { ...reportData, title: 'Ubicación de libros', type: 'table' }
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
		const data = await getBookLocationDetail(req.filterQuery, populate)
		const columns = [
			{ title: 'Sede', value: (row) => row.institution.name },
			{ title: 'Ubicación', value: 'location' },
			{ title: 'Estatus', value: (row) => (row.active ? 'Activo' : 'No activo') },
			{ title: 'Creado', value: (row) => mdy(row.createdAt) }
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
				data: { reportData, title: 'Ubicación de libro', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
