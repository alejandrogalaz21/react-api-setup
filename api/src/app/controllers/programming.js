import Programming from './../models/programming'
import { programmingSaveValidation } from './../validation/programming'
import pagination from './../../util/pagination'
import Schedule from './../models/schedule'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getProgramming, getProgrammingDetail } from '../queries/programming.report'
import { mdy } from '../../util/dates'
import { createMatrixt, getDetail } from '../../util/reports'

export const populate = [
	{ path: 'cycle', select: 'name startDate endDate' },
	{ path: 'institution', select: 'name code' },
	{ path: 'group', select: 'name' },
	{
		path: 'schedule',
		select: 'name assignmentTutor',
		populate: [
			{
				path: 'assignmentTutor',
				select: 'program startDate endDate schedule uuid',
				populate: [
					{
						path: 'program',
						select: 'name areas',
						populate: [{ path: 'areas', select: 'color' }]
					}
				]
			}
		]
	}
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await Programming.find(req.filterQuery)
			.sort({ updatedAt: -1 })
			.populate('detail.created_by', 'name lastName')
			.populate([
				{ path: 'cycle', select: 'name' },
				{ path: 'group', select: 'name' },
				{ path: 'schedule', select: 'name' },
				{ path: 'institution', select: 'code name' }
			])

		if (req.query.page && req.query.size) {
			payload = await pagination(Programming)(req.query)
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
		const result = await Programming.findOne(req.filterQuery)
			.populate('created_by updated_by', 'name lastName')
			.populate(populate)
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

		const validate = await programmingSaveValidation(Programming)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nueva programación agregada',
			created_by
		}

		const data = { ...request, detail: [detail] }
		const payload = await Programming.create(data).then((doc) => {
			return Schedule.updateMany({ _id: { $in: request.schedule } }, { programmingId: doc._id }).then(() => doc)
		})

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
		const validate = await programmingSaveValidation(Programming)(request, request.uuid)
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

		const validate = await programmingSaveValidation(Programming)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const data = { ...payload, updated_by, $push: { detail } }

		const historic = await Programming.findOne(query)
		const result = await Programming.findOneAndUpdate(query, data, {
			new: true
		})

		if (historic.schedule.toString() !== result.schedule.toString()) {
			await Schedule.findOneAndUpdate({ _id: historic.schedule }, { programmingId: null })
			await Schedule.findOneAndUpdate({ _id: result.schedule }, { programmingId: result._id })
		}

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

		const { active } = await Programming.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await Programming.findOneAndUpdate(query, data, { new: true })

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
		const result = await Programming.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
	try {
		const data = await getProgramming(req.filterQuery)
		const columns = [
			{ title: 'Horario', value: (row) => row.schedule.name },
			{ title: 'Ciclo', value: (row) => row.cycle.name },
			{ title: 'Grupo', value: (row) => row.group.name },
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
				data: { ...reportData, title: 'Programación', type: 'table' }
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
		const data = await getProgrammingDetail(req.filterQuery, populate)
		const columns = [
			{ title: 'Horario', value: (row) => row.schedule.name },
			{ title: 'Ciclo', value: (row) => row.cycle.name },
			{ title: 'Fecha de Incio', value: (row) => mdy(row.cycle.startDate) },
			{ title: 'Fecha de Finalización', value: (row) => mdy(row.cycle.endDate) },
			{ title: 'Grupo', value: (row) => row.group.name },
			{ title: 'Sede', value: (row) => row.institution.name },
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
				data: { reportData, title: 'Programación', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
