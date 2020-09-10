import jsreport from 'jsreport'
import Cycle from './../models/cycle'
import { cycleSaveValidation } from './../validation/cycle'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getCycle, getCycleDetail } from './../queries/cycle.report'
import { createMatrix, getDetail } from './../../util/reports'
import { getPartnersToChangeGroup } from './../queries/partner.report'
import { getAllNotEvaluatedPosition } from './../dal/input'
import pagination from './../../util/pagination'
import { getInstitutionsByUser } from './chart'
import { mdy, calculateAge } from './../../util/dates'
import AssignmentTutor from './../models/assignmentTutor'

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await Cycle.find()
      .populate('detail.created_by', 'name lastName')
      .sort({ updatedAt: -1 })

    if (req.query.page && req.query.size) {
      payload = await pagination(Cycle)(req.query)
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
    const result = await Cycle.findOne(req.params)
      .populate('created_by updated_by', 'name lastName')
      .select('-detail')
      .lean()

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Get current cycle based on dates
export const showCurrent = async (req, res) => {
  try {
    const result = await Cycle.findOne({
      closed: false,
      active: true
    })
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params     req, res, next
 * @desc
 */
export const readCycle = async (req, res) => {
  try {
    const result = await Cycle.findOne({
      closed: false,
      active: true
    })
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Return partners whose group must be changed because exceed the age limit
export const getGroupChange = async (req, res) => {
  try {
    const result = []
    const institutions = await getInstitutionsByUser(req.user)

    for (const institution of institutions) {
      const data = await getPartnersToChangeGroup(req.query.date, null, { institution })
      result.push({ data, institution })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Filter the position whose evaluation is not submitted
export const getPositionsToEvaluate = async (req, res) => {
  try {
    const result = []
    const institutions = await getInstitutionsByUser(req.user)

    for (const institution of institutions) {
      const data = await getAllNotEvaluatedPosition({ institutionId: institution })
      const filtered = data.filter(position => position.users.length > 0)
      result.push({ data: filtered, institution })
    }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Filter the assignments whose evaluation is not submitted
export const getAssignmentsToEvaluate = async (req, res) => {
  try {
    const result = []
    const institutions = await getInstitutionsByUser(req.user)

    for (const institution of institutions) {
      const data = await AssignmentTutor.find({
        institution,
        evaluated: false,
        scheduleId: { $ne: null }
      })
        .populate('program institution', 'name')
        .populate('user', 'name lastName')

      result.push({ data, institution })
    }

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

    const validate = await cycleSaveValidation(Cycle)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const detail = { cause: 'Creación', description: 'Nuevo ciclo agregado', created_by }
    const data = { ...request, active: true, detail: [detail] }

    const payload = await Cycle.create(data)

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
    const validate = await cycleSaveValidation(Cycle)(request, request.uuid)
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

    const validate = await cycleSaveValidation(Cycle)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)

    detail = { ...detail, created_by: updated_by }
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await Cycle.findOneAndUpdate(query, data, { new: true })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Close a cycle, through multiple validations
export const close = async (req, res) => {
  try {
    const updated_by = req.user._id
    const detail = { cause: 'Cierre de ciclo', description: 'Fin del ciclo', created_by: updated_by }

    await Cycle.updateMany({}, { active: false })
    await Cycle.findOneAndUpdate(req.params, { active: false, closed: true, updated_by, $push: { detail } })
    const result = await Cycle.create({ ...req.body, active: true })

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

    const { active } = await Cycle.findOne(query)
    const data = { active: !active, updated_by, $push: { detail } }
    const result = await Cycle.findOneAndUpdate(query, data, { new: true })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Count the number of cycles
export const count = async (req, res) => {
  try {
    const doc = await Cycle.countDocuments().exec()
    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Permanently remove a document
export const destroy = async (req, res) => {
  try {
    const query = { uuid: req.params.uuid }
    const result = await Cycle.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const data = await getCycle(req.query)
    const columns = [
      { title: 'Nombre', value: 'name' },
      { title: 'Fecha de inicio', value: row => mdy(row.startDate) },
      { title: 'Fecha de finalización', value: row => mdy(row.endDate) },
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
        data: { ...reportData, title: 'Ciclos', type: 'table' }
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
    const data = await getCycleDetail(req.params)
    const columns = [
      { title: 'Nombre', value: 'name' },
      { title: 'Fecha de Incio', value: row => mdy(row.startDate) },
      { title: 'Fecha de Finalización', value: row => mdy(row.endDate) },
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
        data: { reportData, title: 'Ciclo', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}

// this method download the PDF report .
export const getGroupChangeReport = async (req, res) => {
  try {
    const data = await getPartnersToChangeGroup(req.query.date, null, req.params)
    const columns = [
      { title: 'Fecha', value: row => mdy(row.date) },
      { title: 'Nombre', value: row => `${row.name} ${row.lastName}` },
      { title: 'Matricula', value: row => (row.id ? row.id : 'Visitante') },
      { title: 'Sede', value: row => row.institution.name },
      { title: 'Grupo Anterior', value: row => (row.group.name ? row.group.name : 'No asignado') },
      { title: 'Nuevo grupo', value: row => (row.newGroup.name ? row.newGroup.name : 'EGRESA') },
      { title: 'Edad a cumplir', value: row => calculateAge(row.birthDate) },
      { title: 'Fecha de nacimiento', value: row => mdy(row.birthDate) }
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
        data: { ...reportData, title: 'Socios a cambiar de grupo', type: 'table' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
