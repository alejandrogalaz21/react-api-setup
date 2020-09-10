import Areas from './../models/areas'
import { areasSaveValidation } from './../validation/areas'
import pagination from './../../util/pagination'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getAreas, getAreasDetail } from '../queries/areas.report'
import { mdy } from '../../util/dates'
import { createMatrix, getDetail } from '../../util/reports'

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await Areas.find().sort({ updatedAt: -1 }).populate('detail.created_by', 'name lastName').lean()

		if (req.query.page && req.query.size) {
			payload = await pagination(Areas)(req.query)
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
		const result = await Areas.findOne(req.params)
			.select('-detail')
			.populate('created_by updated_by', 'name lastName')
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

		const validate = await areasSaveValidation(Areas)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = { cause: 'Creación', description: 'Nueva área agregada', created_by }
		const data = { ...request, detail: [detail] }
		const payload = await Areas.create(data)

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
		const validate = await areasSaveValidation(Areas)(request, request.uuid)
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

		const validate = await areasSaveValidation(Areas)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await Areas.findOneAndUpdate(query, data, { new: true })

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

		const { active } = await Areas.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await Areas.findOneAndUpdate(query, data, { new: true })

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
		const result = await Areas.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
	try {
		const data = await getAreas(req.query)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Descripción', value: 'description' },
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
				data: { ...reportData, title: 'Áreas', type: 'table' }
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
		const data = await getAreasDetail(req.params)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Descripción', value: 'description' },
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
				data: { reportData, title: 'Área', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
