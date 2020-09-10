import AssignmentTutor from './../models/assignmentTutor'
import Cycle from './../models/cycle'
import { assignmentTutorSaveValidation } from './../validation/assignmentTutor'
import pagination from './../../util/pagination'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import {
  getAssignmentTutor,
  getAssignmentTutorDetail
} from '../queries/assignmentTutor.report'
import { mdy } from '../../util/dates'
import { createMatrix, getDetail } from '../../util/reports'

const populate = [
  {
    path: 'program',
    select: 'name areas',
    populate: [{ path: 'areas', select: 'color' }]
  },
  {
    path: 'user',
    select: 'name lastName institutions position',
    populate: [
      { path: 'institutions', select: 'name' },
      { path: 'position', select: 'name' }
    ]
  },
  { path: 'schedule.classroom', select: 'name' },
  { path: 'institution', select: 'name' }
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await AssignmentTutor.find(req.filterQuery)
      .sort({ updatedAt: -1 })
      .select('-evaluated -cycle -schedule')
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
    if (req.query.page && req.query.size) {
      payload = await pagination(AssignmentTutor)(req.query)
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
    const result = await AssignmentTutor.findOne(req.filterQuery)
      .populate(populate)
      .populate('created_by updated_by', 'name lastName')
      .select('-detail -evaluated -cycle')
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

    const validate = await assignmentTutorSaveValidation(AssignmentTutor)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const detail = {
      cause: 'Creación',
      description: 'Nueva asignacion agregada',
      created_by
    }

    const cycle = await Cycle.findOne({
      closed: false,
      active: true
    })

    const data = { ...request, detail: [detail], cycle: cycle._id }
    const payload = await AssignmentTutor.create(data)

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
    const validate = await assignmentTutorSaveValidation(AssignmentTutor)(
      request,
      request.uuid
    )
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

    const validate = await assignmentTutorSaveValidation(AssignmentTutor)(
      payload,
      query.uuid
    )
    if (!validate.isValid) return res.status(400).json(validate)

    detail = { ...detail, created_by: updated_by }
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await AssignmentTutor.findOneAndUpdate(query, data, { new: true })

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

    const { active } = await AssignmentTutor.findOne(query)
    const data = { active: !active, updated_by, $push: { detail } }
    const result = await AssignmentTutor.findOneAndUpdate(query, data, { new: true })

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
    const result = await AssignmentTutor.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const data = await getAssignmentTutor(req.filterQuery, populate)
    const columns = [
      { title: 'Profesor', value: row => row.user.name },
      { title: 'Programa', value: row => row.program.name },
      { title: 'Fecha inicio', value: row => mdy(row.startDate) },
      { title: 'Fecha final', value: row => mdy(row.endDate) },
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
        data: { ...reportData, title: 'Asignación de Tutores', type: 'table' }
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
    const data = await getAssignmentTutorDetail(req.filterQuery, populate)
    const columns = [
      { title: 'Profesor', value: row => row.user.name + ' ' + row.user.lastName },
      { title: 'Programa', value: row => row.program.name },
      { title: 'Fecha Inicial', value: row => mdy(row.startDate) },
      { title: 'Fecha Final', value: row => mdy(row.endDate) },
      {
        title: 'Horario',
        value: row =>
          row.schedule.map(
            c => ` ${c.classroom.name} - ${c.day}: ${c.startHour} -  ${c.endHour}`
          )
      },
      { title: 'Asignado', value: row => (row.scheduleId ? 'Sí' : 'No') },
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
        data: { reportData, title: 'Asignación de tutor', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
