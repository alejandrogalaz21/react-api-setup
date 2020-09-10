import jsreport from 'jsreport'
import { mdy } from '../../util/dates'
import Program from './../models/program'
import pagination from './../../util/pagination'
import { createMatrix, getDetail } from '../../util/reports'
import { programSaveValidation } from './../validation/program'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getProgram, getProgramDetail } from '../queries/program.report'

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await Program.find()
			.sort({ updatedAt: -1 })
			.populate('areas', 'name color')
			.populate('detail.created_by', 'name lastName')
		if (req.query.page && req.query.size) {
			payload = await pagination(Program)(req.query)
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
		const result = await Program.findOne(req.params)
			.populate('areas', 'name')
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

		const validate = await programSaveValidation(Program)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nuevo programa agregado',
			created_by
		}

		const data = { ...request, detail: [detail] }
		const payload = await Program.create(data)

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
		const validate = await programSaveValidation(Program)(request, request.uuid)
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

		const validate = await programSaveValidation(Program)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await Program.findOneAndUpdate(query, data, { new: true })

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

		const { active } = await Program.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await Program.findOneAndUpdate(query, data, { new: true })

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
		const result = await Program.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
	try {
		const data = await getProgram(req.query)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Área', value: (row) => row.areas.name },
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
				data: { ...reportData, title: 'Programas', type: 'table' }
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
		const data = await getProgramDetail(req.params)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Descripción', value: 'description' },
			{ title: 'Área', value: (row) => row.areas.name },
			{
				title: 'Objetivos',
				value: (row) => row.objectives.map((objective) => ` ${objective}`)
			},
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
				data: { reportData, title: 'Programa', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
