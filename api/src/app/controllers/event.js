import jsreport from 'jsreport'
import Event from './../models/event'
import { mdy } from './../../util/dates'
import pagination from './../../util/pagination'
import { saveValidation } from './../validation/event'
import { createMatrix, getDetail } from './../../util/reports'
import { getEvents, getEvent } from './../queries/event.report'
import { downloadReportAndDelete } from './../../util/bufferReport'

const populate = [
	{
		path: 'entries.partner exits.partner',
		populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
	}
]
// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await Event.find(req.filterQuery)
			.populate('institution', 'name code')
			.populate('detail.created_by', 'name lastName')
			.select('uuid name date hour entries active createdAt detail')
			.sort({ updatedAt: -1 })
			.lean()

		if (req.query.page && req.query.size) {
			payload = await pagination(Event)(req.query)
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
		const result = await Event.findOne(req.filterQuery)
			.select('-detail')
			.populate('institution', 'name code')
			.populate('created_by updated_by', 'name lastName')
			.populate(populate)
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

		const validate = await saveValidation(Event)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nuevo evento agregado',
			created_by
		}

		const data = { ...request, detail: [detail] }
		const payload = await Event.create(data)

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
		const validate = await saveValidation(Event)(request, request.uuid)
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

		const validate = await saveValidation(Event)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail.created_by = updated_by
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await Event.findOneAndUpdate(query, data, { new: true })

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

		const { active } = await Event.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await Event.findOneAndUpdate(query, data, { new: true })

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
		const result = await Event.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
	try {
		const data = await getEvents(req.filterQuery)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Fecha', value: (row) => mdy(row.date) },
			{ title: 'Hora', value: 'hour' },
			{ title: 'Asistencias', value: (row) => row.entries.length },
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
				data: { ...reportData, title: 'Eventos', type: 'table' }
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
		const data = await getEvent(req.filterQuery)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Descripción', value: 'description' },
			{ title: 'Fecha', value: (row) => mdy(row.date) },
			{ title: 'Hora', value: 'hour' },
			{ title: 'Categoría', value: 'category' },
			{ title: 'Asistencias', value: (row) => row.entries.length },
			{ title: 'Estatus', value: (row) => (row.active ? 'Activo' : 'No activo') },
			{ title: 'Lugar', value: (row) => row.place.address },
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
				data: { reportData, title: 'Evento', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
