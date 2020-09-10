import Schedule from './../models/schedule'
import { scheduleSaveValidation } from './../validation/schedule'
import pagination from './../../util/pagination'
import AssignmentTutor from './../models/assignmentTutor'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getSchedule, getScheduleDetail } from './../queries/schedule.report'
import { mdy } from '../../util/dates'
import { createMatrix, getDetail } from '../../util/reports'

const populate = [
  {
    path: 'assignmentTutor',
    select: 'user program startDate endDate schedule uuid scheduleId',
    populate: [
      {
        path: 'user',
        select: 'name lastName fullName institutions',
        populate: [{ path: 'institutions', select: 'name' }]
      },
      {
        path: 'program',
        select: 'name areas',
        populate: [{ path: 'areas', select: 'color' }]
      }
    ]
  },
  { path: 'institution', select: 'name' }
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await Schedule.find(req.filterQuery)
      .select('-assignmentTutor')
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
      .sort({ updatedAt: -1 })
      .lean()

    if (req.query.page && req.query.size) {
      payload = await pagination(Schedule)(req.query)
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
    const result = await Schedule.findOne(req.filterQuery)
      .populate(populate)
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

    const validate = await scheduleSaveValidation(Schedule)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const detail = {
      cause: 'Creación',
      description: 'Nuevo horario agregado',
      created_by
    }

    const data = { ...request, detail: [detail] }
    const payload = await Schedule.create(data).then(doc => {
      return AssignmentTutor.updateMany(
        { _id: { $in: request.assignmentTutor } },
        { scheduleId: doc._id }
      ).then(() => doc)
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
    const validate = await scheduleSaveValidation(Schedule)(request, request.uuid)
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

    const validate = await scheduleSaveValidation(Schedule)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)

    detail.created_by = updated_by
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await Schedule.findOneAndUpdate(query, payload, { new: true })
      .then(item => {
        return AssignmentTutor.updateMany(
          { _id: { $in: item.assignmentTutor } },
          { scheduleId: null }
        )
      })
      .then(() => {
        return Schedule.findOneAndUpdate(query, data)
          .populate(populate)
          .then(doc => {
            return AssignmentTutor.updateMany(
              { _id: { $in: payload.assignmentTutor } },
              { scheduleId: doc._id }
            ).then(() => doc)
          })
      })

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

    const { active } = await Schedule.findOne(query)
    const data = { active: !active, updated_by, $push: { detail } }
    const result = await Schedule.findOneAndUpdate(query, data, { new: true })

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
    const result = await Schedule.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const data = await getSchedule(req.filterQuery)
    const columns = [
      { title: 'Nombre', value: 'name' },
      { title: 'Sede', value: row => row.institution.name },
      { title: 'Estatus', value: row => (row.active ? 'Activo' : 'No activo') },
      { title: 'Creado', value: row => mdy(row.createdAt) }
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
        data: { ...reportData, title: 'Horarios', type: 'table' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
  try {
    const data = await getScheduleDetail(req.filterQuery, populate)
    const columns = [
      { title: 'Nombre', value: 'name' },
      {
        title: 'Asignatura de tutor',
        value: row =>
          row.assignmentTutor.map(
            c => `${c.user.name} ${c.user.lastName} - ${c.program.name}`
          )
      },
      { title: 'Sede', value: row => row.institution.name },
      { title: 'Estatus', value: row => (row.active ? 'Activo' : 'No activo') },
      { title: 'Creado', value: row => mdy(row.createdAt) }
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
        data: { reportData, title: 'Horario', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
