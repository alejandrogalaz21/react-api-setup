import * as tutorEvaluation from './../dal/tutorEvaluation'
import TutorEvaluation from './../models/tutorEvaluation'
import { tutorEvaluationSaveValidation } from './../validation/tutorEvaluation'
import pagination from '../../util/pagination'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getTutorEvaluationDetail } from './../queries/tutorEvaluation.report'
import { getDetail } from './../../util/reports'
import { average } from './../../util'
import { mdy } from './../../util/dates'

const populate = [
	{
		path: 'user',
		select: 'name lastName thumbnail',
		populate: [ { path: 'thumbnail', select: 'path' } ]
	},
	{
		path: 'position',
		select: 'name'
	}
]
// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await TutorEvaluation.find(req.filterQuery)
			.sort({ updateAt: -1 })
			.populate('detail.created_by', 'name lastName')
			.populate('institution', 'name code')
			.populate([
				{
					path: 'user',
					select: 'name lastName thumbnail',
					populate: [ { path: 'thumbnail', select: 'path' } ]
				},
				{
					path: 'position',
					select: 'name'
				}
			])
			.lean()
		if (req.query.page && req.query.size) {
			payload = await pagination(TutorEvaluation)(req.query)
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
		const result = await TutorEvaluation.findOne(req.filterQuery)
			.populate([
				{
					path: 'user',
					select: 'name lastName thumbnail',
					populate: [ { path: 'thumbnail', select: 'path' } ]
				},
				{
					path: 'position',
					select: 'name'
				}
			])
			.populate('institution', 'name code')
			.populate('created_by updated_by', 'name lastName')
			.select('-detail -code')
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

		const validate = await tutorEvaluationSaveValidation(TutorEvaluation)(req.body[0])
		if (!validate.isValid) return res.status(400).json(validate)

		const detail = {
			cause: 'Creación',
			description: 'Nueva evaluación agregada',
			created_by
		}

		const request = req.body.map((item) => ({
			...item,
			created_by,
			detail: [ detail ]
		}))

		const payload = await TutorEvaluation.create(request)

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
		const validate = await tutorEvaluationSaveValidation(TutorEvaluation)(request)
		return res.status(200).json(validate)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

/**
 * @params  req, res
 * @desc    update a single record
 */
export const update = async (req, res) => {
	try {
		const updated_by = req.user._id
		let { payload, detail } = req.body
		const query = { uuid: req.params.uuid }

		const validate = await tutorEvaluationSaveValidation(TutorEvaluation)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail.created_by = updated_by
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await TutorEvaluation.findOneAndUpdate(query, data, { new: true })

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

/**
 * @params  req, res
 * @desc    toggle the active property of a record
 */
export const toggle = async (req, res) => {
	try {
		const updated_by = req.user._id
		const query = { uuid: req.params.uuid }
		const detail = { ...req.body.detail, created_by: updated_by }

		const { active } = await TutorEvaluation.findOne(query)
		const data = { active: !active, updated_by, $push: { detail } }
		const result = await TutorEvaluation.findOneAndUpdate(query, data, { new: true })

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

/**
 * @params  req, res
 * @desc    permanently delete a record
 */
export const destroy = async (req, res) => {
	try {
		const params = req.params
		const result = await tutorEvaluation.destroyTutorEvaluation(params)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
	try {
		const options = [ 'Malo', 'Regular', 'Bueno' ]

		const data = await getTutorEvaluationDetail(req.params, populate)

		const columns = [
			{ title: 'Colaborador', value: (row) => `${row.user.name} ${row.user.lastName}` },
			{ title: 'Puesto', value: (row) => row.position.name },
			{ title: 'Año de evaluación', value: 'year' },
			{ title: 'Fecha de evaluación', value: (row) => mdy(row.createdAt) },
			{ title: 'Resultado', value: (row) => options[Math.round(average(row.answers) - 1)] },
			{ title: 'Comentario', value: 'comment' }
		]
		console.log(data)
		const information = getDetail(data, columns)

		const reportData = data.questions.reduce((pre, cur, index) => {
			pre.push([ cur, options[data.answers[index] - 1] ])
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
					title: 'Evaluación a Colaborador',
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
