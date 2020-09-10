import jsreport from 'jsreport'
import Partner from './../models/partner'
import AcademicHistory from './../models/academicHistory'
import { mdy } from './../../util/dates'
import pagination from './../../util/pagination'
import { saveValidation } from './../validation/bookLoan'
import { createMatrix, getDetail } from './../../util/reports'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getAcademicHistoryByPartner, getAcademicHistory } from './../queries/academicHistory.report'

const populate = [
	{
		path: 'partner',
		populate: [
			{ path: 'school', select: 'uuid name' },
			{ path: 'group', select: 'uuid name color' },
			{ path: 'thumbnail', select: 'path' }
		],
		select: 'uuid name lastName school group thumbnail status'
	},
	{ path: 'school', select: 'uuid name' },
	{ path: 'institution', select: 'name code' }
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await AcademicHistory.find(req.filterQuery)
			.populate(populate)
			.populate('institution', 'name code')
			.populate('detail.created_by', 'name lastName')
			.select('uuid partner school shift startDate detail status')
			.sort({ updatedAt: -1 })
			.lean()

		if (req.query.page && req.query.size) {
			payload = await pagination(AcademicHistory)(req.query)
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
		const result = await AcademicHistory.findOne(req.filterQuery)
			.populate(populate)
			.select('-detail')
			.populate('created_by updated_by', 'name lastName')

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

		const validate = await saveValidation(AcademicHistory)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nuevo registro agregado',
			created_by
		}

		const partnerDoc = await Partner.findOne({ _id: request.partner })
		const data = { ...request, institution: partnerDoc.institution, detail: [detail] }
		const payload = await AcademicHistory.create(data)
		const result = await AcademicHistory.findOne(payload)
			.populate(populate)
			.select('uuid partner school shift startDate detail status')
			.lean()

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
		const validate = await saveValidation(AcademicHistory)(request, request.uuid)
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

		const validate = await saveValidation(AcademicHistory)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await AcademicHistory.findOneAndUpdate(query, data, {
			new: true
		}).populate(populate)

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

		const { active } = await AcademicHistory.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await AcademicHistory.findOneAndUpdate(query, data, { new: true })

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
		const result = await AcademicHistory.findOneAndDelete(query)
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
		const result = await AcademicHistory.find({ partner: partner._id, ...query })
			.populate(populate)
			.populate('detail.created_by', 'name lastName')
			.select('uuid partner school shift startDate detail status')
			.sort({ updatedAt: -1 })
			.lean()

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report .
export const exportPdfReportByPartner = async (req, res) => {
	try {
		const data = await getAcademicHistoryByPartner(req.filterQuery, populate)
		const columns = [
			{ title: 'Escuela', value: (row) => row.school.name },
			{ title: 'Turno', value: 'shift' },
			{ title: 'Fecha Incial', value: (row) => mdy(row.startDate) }
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
		const data = await getAcademicHistory(req.filterQuery, populate)
		const columns = [
			{ title: 'Grupo del socio', value: (row) => row.partner.group.name },
			{ title: 'Escuela', value: (row) => row.school.name },
			{ title: 'Turno', value: 'shift' },
			{ title: 'Fecha de ingreso', value: (row) => mdy(row.startDate) },
			{
				title: 'Calificaciones',
				value: (row) =>
					row.evaluations.map(
						(e) =>
							`Grado: ${e.grade}, Grupo: ${e.group}, Español: ${e.spanish}, Matemáticas: ${e.mathematics}`
					)
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
				data: { reportData, title: 'Historial Académico', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
