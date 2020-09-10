import jsreport from 'jsreport'
import Partner from './../models/partner'
import Schedule from './../models/schedule'
import Programming from './../models/programming'
import AssignmentTutor from './../models/assignmentTutor'
import PartnerEvaluation from './../models/partnerEvaluation'
import { saveValidation } from './../validation/partnerEvaluation'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getPartnerEvaluationDetail } from '../queries/partnerEvaluation.report'
import { getDetail, } from './../../util/reports'
import pagination from './../../util/pagination'
import { mdy } from './../../util/dates'
import { average } from './../../util'
import { isEmpty } from '../../util'

const populate = [
	{
		path: 'partner',
		populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group', select: 'uuid name color' }],
		select: 'uuid name lastName fullName thumbnail group id'
	},
	{
		path: 'user',
		populate: [{ path: 'position', select: 'uuid name' }, { path: 'thumbnail', select: 'path' }],
		select: 'uuid name lastName fullName position active thumbnail'
	},
	{
		path: 'program',
		populate: { path: 'areas', select: 'uuid name color active' }
	},
	{ path: 'group', select: 'uuid name color' },
	{ path: 'cycle assignmentTutor', select: '-detail' }
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await PartnerEvaluation.find(req.filterQuery)
			.populate(populate)
			.populate('detail.created_by', 'name lastName')
			.populate('institution', 'name code')
			.sort({ updatedAt: -1 })
		if (req.query.page && req.query.size) {
			payload = await pagination(PartnerEvaluation)(req.query)
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
		const result = await PartnerEvaluation.findOne(req.filterQuery)
			.populate(populate)
			.populate('created_by updated_by', 'name lastName')
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
		const { institution } = await Partner.findById(req.body[0].partner)

		const validate = await saveValidation(PartnerEvaluation)(req.body[0])
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nueva evaluación agregada',
			created_by
		}

		const request = req.body.map((item) => ({
			...item,
			institution,
			created_by,
			detail: [detail]
		}))

		const payload = await PartnerEvaluation.create(request)

		// update the assignment tutor record to evaluated true
		await AssignmentTutor.findOneAndUpdate({ _id: payload[0].assignmentTutor }, { evaluated: true })

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
		const validate = await saveValidation(PartnerEvaluation)(request)
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

		const validate = await saveValidation(PartnerEvaluation)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail.created_by = updated_by
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await PartnerEvaluation.findOneAndUpdate(query, data, { new: true })

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

		const { active } = await PartnerEvaluation.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await PartnerEvaluation.findOneAndUpdate(query, data, { new: true })

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
		const result = await PartnerEvaluation.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Retrieve all documents filtered by one partner
export const getByPartner = async (req, res) => {
	try {
		const partner = await Partner.findOne({ uuid: req.params.partneruuid })
		const result = await PartnerEvaluation.find({ partner: partner._id }).populate(populate).sort({ updatedAt: -1 })

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Retrieve the list of partners to evaluate for an specific program
export const getPartnersToEvaluate = async (req, res) => {
	try {
		const request = req.body
		let result = {}

		const { institution } = req.filterQuery
		const query = institution ? { institution } : {}

		const tutorProgram = await AssignmentTutor.findOne({
			user: request.user,
			evaluated: false
		})
			.populate({ path: 'program', populate: 'areas' })
			.populate('user')

		if (!isEmpty(tutorProgram)) {
			const schedule = await Schedule.findOne({
				assignmentTutor: { $in: request.assignmentTutor }
			})

			const programm = await Programming.findOne({
				schedule,
				cycle: request.cycle
			}).populate('cycle group institution')

			if (isEmpty(programm)) {
				return res.status(200).json({ message: 'Esta materia no se ha asignado desde Programación' })
			}
			
			console.log(tutorProgram.institution)

			const partners = await Partner.find({
				...query,
				group: programm.group,
				institution: tutorProgram.institution,
				status: 1,
			}).populate('thumbnail', 'path')

			result = {
				partners,
				programming: programm,
				assignmentTutor: tutorProgram
			}
		}

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({error})
	}
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
	try {
		const data = await getPartnerEvaluationDetail(req.filterQuery, populate)

		const columns = [
			{ title: 'Socio', value: (row) => row.partner.fullName },
			{ title: 'Matrícula', value: (row) => row.partner.id },
			{ title: 'Ciclo', value: (row) => row.cycle.name },
			{ title: 'Grupo', value: (row) => row.group.name },
			{ title: 'Programa', value: (row) => row.program.name },
			{ title: 'Tutor', value: (row) => row.user.fullName },
			{ title: 'Fecha de evaluación', value: (row) => mdy(row.createdAt) },
			{ title: 'Resultado', value: (row) => Math.round(average(row.answers)) },
			{ title: 'Comentario', value: 'comment' }
		]

		const information = getDetail(data, columns)

		const reportData = data.objectives.reduce((pre, cur, index) => {
			pre.push([cur, data.answers[index]])
			return pre
		}, [])

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
				data: {
					information,
					reportData,
					title: 'Evaluación a Socio',
					type: 'objectives'
				}
			})
			.then(async (buffer) => downloadReportAndDelete(res, buffer))
			.catch((error) => console.log(error))
	} catch (error) {
		console.log(error)
		return res.status(500).json(JSON.stringify(error, '', 2))
	}
}
