import jsreport from 'jsreport'
import School from './../models/school'
import { mdy } from './../../util/dates'
import pagination from './../../util/pagination'
import { saveValidation } from './../validation/school'
import { createMatrix, getDetail } from './../../util/reports'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getSchool, getSchoolDetail } from './../queries/school.report'

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await School.find(req.filterQuery)
			.sort({ updatedAt: -1 })
			.populate('detail.created_by', 'name lastName')
			.populate('institution', 'name code')
			.select('uuid name phone active grade address comments institution createdAt detail')
			.lean()
		if (req.query.page && req.query.size) {
			payload = await pagination(School)(req.query)
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
		const result = await School.findOne(req.filterQuery)
			.populate('created_by updated_by', 'name lastName')
			.populate('institution', 'name code')
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

		const validate = await saveValidation(School)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nueva escuela agregada',
			created_by
		}

		const data = { ...request, detail: [detail] }
		const payload = await School.create(data)

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
		const validate = await saveValidation(School)(request, request.uuid)
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

		const validate = await saveValidation(School)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await School.findOneAndUpdate(query, data, { new: true })

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

		const { active } = await School.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await School.findOneAndUpdate(query, data, { new: true })

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
		const result = await School.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
	try {
		const data = await getSchool(req.filterQuery)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Teléfono', value: 'phone' },
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
				data: { ...reportData, title: 'Escuelas', type: 'table' }
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
		const data = await getSchoolDetail(req.filterQuery)
		const columns = [
			{ title: 'Nombre', value: 'name' },
			{ title: 'Teléfono', value: 'phone' },
			{ title: 'Grado', value: 'grade' },
			{ title: 'Comentarios', value: 'comments' },
			{ title: 'Dirección', value: (row) => row.address.address },
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
				data: { reportData, title: 'Escuela', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
