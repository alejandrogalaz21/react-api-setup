import Access from './../models/access'
import Partner from './../models/partner'
import { saveValidation } from './../validation/access'
import pagination from './../../util/pagination'
import requestIp from 'request-ip'
import geoip from 'geoip-lite'
import moment from 'moment'
import { emitAccess } from '../../sockets/accessWs'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getAccess, getAccessByPartner } from './../queries/access.report'
import { mdy, hms } from '../../util/dates'
import { createMatrix } from '../../util/reports'
import { isEmpty } from './../../util/index'

const select = 'uuid partner date entry exit detail institution '
export const populate = {
  path: 'partner',
  populate: [
    { path: 'thumbnail', select: 'path' },
    { path: 'group', select: 'uuid name color' },
    { path: 'security', select: 'uuid question3 people detail' }
  ],
  select:
    'uuid id name lastName fullName thumbnail group category birthDate security shift status people detail'
}

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await Access.find(req.filterQuery)
      .populate(populate)
      .populate('institution', 'name')
      .select(select)
      .sort({ date: -1 })

    if (req.query.page && req.query.size) {
      payload = await pagination(Access)(req.query)
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
    const result = await Access.findOne(req.filterQuery)
      .populate(populate)
      .populate('institution', 'name code')
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
    let request = { ...req.body, created_by }

    // Geolocation
    const ip = requestIp.getClientIp(request)
    const location = geoip.lookup(ip)

    const validate = await saveValidation(Access)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const partner = await Partner.findOne({ uuid: request.partnerUuid })

    request = { ...request, institution: partner.institution }

    if (partner.status === 0) {
      // Change partner's status from "Nuevo" to "Activo"
      await Partner.findOneAndUpdate({ uuid: request.partnerUuid }, { status: 1 })
    }

    const data = { ...request, partner, ip, location }

    const access = await Access.create(data)
    const result = await Partner.findOneAndUpdate(
      { uuid: request.partnerUuid },
      { $push: { access } },
      { new: true }
    )
      .populate('access', 'date entry exit partner')
      .populate([
        { path: 'thumbnail', select: 'path' },
        { path: 'group', select: 'uuid name color' }
      ])

    res.status(200).json(result)
    emitAccess()
    return
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Validate POST and PUT request before sending those requests
export const validate = async (req, res) => {
  try {
    const request = req.body
    const validate = await saveValidation(Access)(request)
    return res.status(200).json(validate)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Update a document
export const update = async (req, res) => {
  try {
    const { payload, detail } = req.body
    const query = { uuid: req.params.uuid }
    const validate = await saveValidation(Access)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)

    const data = { ...payload, $push: { detail } }
    const result = await Access.findOneAndUpdate(query, data, { new: true })

    res.status(200).json(result)
    emitAccess()
    return
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Logical deletion based on the active property
export const toggle = async (req, res) => {
  try {
    const query = { uuid: req.params.uuid }
    const { active } = await Access.findOne(query)
    const data = { active: !active, $push: { detail: req.body.detail } }
    const result = await Access.findOneAndUpdate(query, data, { new: true })
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
    const result = await Access.findOneAndDelete(query)
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
    const result = await Access.find({ partner: partner._id, ...query })
			.populate(populate)
			.populate('institution', 'name code')
      .select(select)
      .sort({ updatedAt: -1 })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Get the partner access type: exit or entry based on the latest one
export const getType = async (req, res) => {
  try {
    const today = moment().startOf('day')
    const { partneruuid } = req.params

    const partner = await Partner.findOne({ uuid: partneruuid })
    const accesses = await Access.find({
      partner,
      date: {
        $gte: today.toDate(),
        $lte: moment(today)
          .endOf('day')
          .toDate()
      }
    })

    const result =
      accesses.length % 2 === 0
        ? { entry: true, exit: false }
        : { entry: false, exit: true }

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const data = await getAccess(req.filterQuery, populate, select)
    const columns = [
      { title: 'Socio', value: row => row.partner.fullName },
      { title: 'Acceso', value: row => (row.entry ? 'Entrada' : 'Salida') },
      {
        title: 'Fecha',
        value: row => mdy(row.date)
      },
      {
        title: 'Hora',
        value: row => hms(row.date)
      },
      {
        title: 'Acompañado',
        value: row => (!isEmpty(row.detail) ? row.detail : 'No')
      }
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
        data: { ...reportData, title: 'Control de Accesos', type: 'table' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}

// this method download the PDF report .
export const exportPdfReportByPartner = async (req, res) => {
  try {
    const data = await getAccessByPartner(req.filterQuery, populate, select)

    const columns = [
      { title: 'Socio', value: row => row.partner.fullName },
      { title: 'Acceso', value: row => (row.entry ? 'Entrada' : 'Salida') },
      {
        title: 'Fecha',
        value: row => mdy(row.date)
      },
      {
        title: 'Hora',
        value: row => hms(row.date)
      },
      {
        title: 'Acompañado',
        value: row => (!isEmpty(row.detail) ? row.detail : 'No')
      }
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
        data: { ...reportData, title: 'Accesos del Socio', type: 'table' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
