import jsreport from 'jsreport'
import Partner from './../models/partner'
import DiagnosticEvaluation from './../models/diagnosticEvaluation'
import { mdy } from './../../util/dates'
import pagination from '../../util/pagination'
import { getDetail } from './../../util/reports'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { saveValidation } from './../validation/diagnosticEvaluation'
import { getEvaluationDiagnostic } from '../queries/diagnostic.report'

const populate = [
	{
		path: 'partner',
		select: 'name lastName uuid thumbnail _id',
		populate: [{ path: 'thumbnail', select: 'path' }]
	},
	{
		path: 'user',
		select: 'name lastName uuid thumbnail _id',
		populate: [{ path: 'thumbnail', select: 'path' }]
	},
	{ path: 'institution', select: 'name code' }
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await DiagnosticEvaluation.find(req.filterQuery)
			.sort({ updateAt: -1 })
			.select('active createdAt created_by date detail partner updatedAt updated_by user uuid institution _id')
			.populate(populate)
			.populate('detail.created_by', 'name lastName')
			.lean()
		if (req.query.page && req.query.size) {
			payload = await pagination(DiagnosticEvaluation)(req.query)
		}
		return res.status(200).json(payload)
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

		const partner = await Partner.findOne({ uuid: req.params.uuid })
		const result = await DiagnosticEvaluation.find({ partner: partner._id, ...query })
			.sort({ updateAt: -1 })
			.select('active createdAt created_by date detail updatedAt updated_by uuid institution _id')
			.populate(populate)
			.populate('detail.created_by', 'name lastName')

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Retrieve a single document in the collection
export const show = async (req, res) => {
	try {
		const result = await DiagnosticEvaluation.findOne(req.filterQuery)
			.select('-detail')
			.populate(populate)
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
		let request = { ...req.body, created_by }

		const validate = await saveValidation(DiagnosticEvaluation)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nueva evaluación diagnostica agregada',
			created_by
		}

		const partnerDoc = await Partner.findOne({ _id: request.partner })
		const data = { ...request, institution: partnerDoc.institution, detail: [detail] }
		const payload = await DiagnosticEvaluation.create(data)
		const result = await DiagnosticEvaluation.findOne(payload).populate(populate)

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
		const validate = await saveValidation(DiagnosticEvaluation)(request, request.uuid)
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

		const validate = await saveValidation(DiagnosticEvaluation)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail.created_by = updated_by
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await DiagnosticEvaluation.findOneAndUpdate(query, data, {
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

		const { active } = await DiagnosticEvaluation.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await DiagnosticEvaluation.findOneAndUpdate(query, data, {
			new: true
		})

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

/**
 * @params     req, res
 * @desc
 */
export const destroy = async (req, res) => {
	try {
		const query = { uuid: req.params.uuid }
		const result = await DiagnosticEvaluation.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
	try {
		const data = await getEvaluationDiagnostic(req.params, populate)
		const columns = [
			{ title: 'Orientador', value: (row) => row.user.fullName },
			{ title: 'Fecha', value: (row) => mdy(row.date) },
			{ title: 'Creado', value: (row) => mdy(row.createdAt) },
			{ title: 'Evaluación', value: '' }
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
				data: { reportData, rawHtml: data.evaluation, title: 'Evaluación Diagnóstica', type: 'detail' }
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
