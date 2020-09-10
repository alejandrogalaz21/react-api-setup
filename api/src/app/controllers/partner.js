import jsreport from 'jsreport'
import Partner from './../models/partner'
import Dropout from './../models/dropout'
import Programming from './../models/programming'
import Institution from './../models/institution'
import PartnerParent from './../models/partnerParent'
import PartnerSecurity from './../models/partnerSecurity'
import { isEmpty } from './../../util'
import pagination from './../../util/pagination'
import { padWithZeros } from './../../util/strings'
import { mdy, calculateAge } from './../../util/dates'
import { createMatrix, getDetail } from './../../util/reports'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { saveValidation } from './../validation/partner'
import { populate as programmingPopulate } from './programming'
import { getPartner, getPartnerDetail } from './../queries/partner.report'

const select =
  'uuid name lastName fullName id group thumbnail shift birthDate institution status category '
const populate = [
  { path: 'school father mother family security group' },
  { path: 'thumbnail', select: 'path' },
  { path: 'institution', select: 'uuid name code' }
]

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await Partner.find(req.filterQuery)
      .populate('group', 'name color')
      .populate('thumbnail', 'path')
      .populate('security', 'question3')
      .populate('school', 'name')
      .populate('institution', 'code name')
      .populate('detail.created_by', 'name lastName')
      .select(select + 'detail createdAt address genre category security foodProgram')
      .sort({ updatedAt: -1 })

    if (req.query.page && req.query.size) {
      payload = await pagination(Partner)(req.query)
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
    const result = await Partner.findOne(req.filterQuery)
      .populate('created_by updated_by', 'name lastName')
      .populate(populate)
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

    const request = req.body
    delete request.status

    // validate the incoming request
    const validate = await saveValidation(Partner)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    // historical and detail first subdocuments
    const detail = { cause: 'Creación', description: 'Nuevo socio inscrito', created_by }
    const historical = [
      { change: 'Ingreso', description: 'Inscripción del socio', created_by }
    ]

    const { family, security } = request

    // create partner related documents
    const [familyIds, securityId] = await Promise.all([
      PartnerParent.create(...family),
      PartnerSecurity.create(security)
    ])

    const data = {
      ...request,
      family: familyIds,
      security: securityId,
      detail: [detail],
      created_by
    }

    let payload = data
    if (request.category === 'Socio') {
      // get foreign keys and calculate enrollment id
      const sede = await Institution.findOne({ _id: request.institution })
      const partners = await Partner.countDocuments({
        institution: request.institution,
        category: 'Socio'
      })
      const enrollment = partners + 1
      const id = sede.code + padWithZeros(enrollment, 6) // example: ES000100
      payload = { ...data, id, enrollment, historical }
    } else {
      const visitor = {
        change: 'Ingreso',
        description: 'Inscripción como visitante',
        created_by
      }
      payload = { ...data, historical: [visitor] }
    }

    // create partner document
    const doc = await Partner.create(payload)

    // update the partner related documents with the partner foreign key
    const toUpdate = { partner: doc._id }
    await Promise.all([
      PartnerParent.updateMany({ _id: { $in: familyIds } }, toUpdate),
      PartnerSecurity.findOneAndUpdate({ _id: securityId }, toUpdate)
    ])

    // populate the created partner's document
    const result = await Partner.findOne({ _id: doc._id }).populate(populate)

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
    const validate = await saveValidation(Partner)(request, request.uuid)
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
    delete payload.status
    const query = { uuid: req.params.uuid }

    const validate = await saveValidation(Partner)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)

    detail = { ...detail, created_by: updated_by }
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await Partner.findOneAndUpdate(query, data, { new: true })

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

    const { active } = await Partner.findOne(query)
    const data = { active: !active, updated_by, $push: { detail } }
    const result = await Partner.findOneAndUpdate(query, data, { new: true })
      .populate('group', 'name color')
      .populate('thumbnail', 'path')
      .select(select + 'detail createdAt')

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
    const result = await Partner.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Retrieve basic data about a single document in the collection
export const showInformation = async (req, res) => {
  try {
    const result = await Partner.findOne(req.filterQuery)
      .populate('group', 'name color')
      .populate('school', 'name grade')
      .populate('thumbnail', 'path')
      .populate('security', 'uuid question3 question4')
      .populate('institution', 'uuid name')
      .populate('family', 'uuid name lastName phone cellphone relationship')
      .populate('historical.dropout')
      .select(select + 'school address family genre security historical')

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Retrieve shcedule document for a partner of the current cycle
export const showSchedule = async (req, res) => {
  try {
    const request = req.body

    if (isEmpty(request.group) || isEmpty(request.cycle))
      return res.status(400).json({ error: 'Invalid request' })

    let response = {}
    const programming = await Programming.findOne({ ...request, active: true })
      .populate(programmingPopulate)
      .select('schedule')

    if (!isEmpty(programming)) response = programming.schedule

    return res.status(200).json(response)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const setDropout = async (req, res) => {
  try {
    const request = req.body
    const query = { uuid: req.params.uuid }

    const { status } = await Partner.findOne(query).select('status').lean()
    const historical = { ...request, change: 'Baja' }

    if (status !== 1) {
      const error = 'No se puede dar de baja al socio'
      return res.status(400).json({ error })
    }

    const result = await Partner.findOneAndUpdate(
      query,
      { status: 2, $push: { historical } },
      { new: true }
    )
      .populate('historical.dropout')
      .select('status historical')
      .lean()

    await Dropout.findByIdAndUpdate(historical.dropout, {
      $push: { historical: { partner: result._id } }
    })

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const setActive = async (req, res) => {
  try {
    const request = req.body
    const query = { uuid: req.params.uuid }

    const { status } = await Partner.findOne(query).select('status').lean()

    if (status !== 2) {
      const error = 'No se puede reingresar al socio'
      return res.status(400).json({ error })
    }

    const historical = { ...request, change: 'Activo' }
    const data = { status: 1, $push: { historical } }
    const result = await Partner.findOneAndUpdate(query, data, { new: true })
      .populate('historical.dropout')
      .select('status historical')
      .lean()

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const setGraduate = async (req, res) => {
  try {
    const request = req.body
    const query = { uuid: req.params.uuid }

    const { status } = await Partner.findOne(query).select('status').lean()

    if (status !== 1) {
      const error = 'No se puede egresar al socio'
      return res.status(400).json({ error })
    }

    const historical = { ...request, change: 'Egreso' }
    const data = { status: 3, $push: { historical } }
    const result = await Partner.findOneAndUpdate(query, data, { new: true })
      .populate('historical.dropout')
      .select('status historical')
      .lean()

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Coonvert a visitor to partner
// Update the required fields into the partner related collections
export const convertVisitor = async (req, res) => {
  try {
    const updated_by = req.user._id
    const query = { uuid: req.params.uuid }

    let { payload, detail } = req.body
    const { security, ...general } = payload

    const partner = await Partner.findOne(query).lean()

    if (partner.category !== 'Visitante')
      return res.status(400).json({ message: 'El socio no es visitante' })

    // get foreign keys and calculate enrollment id
    const sede = await Institution.findOne({ _id: partner.institution })
    const partners = await Partner.countDocuments({
      institution: partner.institution,
      category: 'Socio'
    })
    const enrollment = partners + 1
    const id = sede.code + padWithZeros(enrollment, 6) // example: ES000100

    detail = { ...detail, created_by: updated_by }
    const data = {
      ...general,
      id,
      enrollment,
      updated_by,
      $push: {
        historical: { change: 'Ingreso', description: 'Inscripción del socio' },
        detail
      },
      category: 'Socio'
    }

    // update the general and security information
    const result = await Partner.findOneAndUpdate(query, data, { new: true }).lean()
    await PartnerSecurity.findOneAndUpdate({ _id: result.security }, security)

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report .
export const exportPdfReport = async (req, res) => {
  try {
    const partnerStatus = ['Nuevo', 'Activo', 'Baja', 'Egresado']

    const data = await getPartner(req.filterQuery, select)
    const columns = [
      { title: 'Nombre', value: 'name' },
      { title: 'Apellidos', value: 'lastName' },
      { title: 'Matricula', value: row => (row.id ? row.id : 'Visitante') },
      { title: 'Categoría', value: 'category' },
      {
        title: 'Grupo',
        value: row => (row.group.name ? row.group.name : 'No asignado')
      },
      {
        title: 'Turno',
        value: row => (row.shift ? row.shift : 'No asignado')
      },
      {
        title: 'Fecha de nacimiento',
        value: row => mdy(row.birthDate)
      },
      {
        title: 'Estatus',
        value: row => partnerStatus[row.status]
      },
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
        data: { ...reportData, title: 'Socios', type: 'table' }
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
    const relationship = ['Padre', 'Madre', 'Tutor']
    const statusCivil = ['Soltero', 'Casado', 'Viudo', 'Unión libre', 'Divorciado']

    const data = await getPartnerDetail(req.filterQuery, populate)
    const columns = [
      //Datos del socio
      { title: 'Nombre', value: row => `${row.name} ${row.lastName}` },
      { title: 'Matrícula', value: 'id' },
      { title: 'Categoría', value: 'category' },
      { title: 'Género', value: 'genre' },
      { title: 'Fecha de nacimiento', value: row => mdy(row.birthDate) },
      { title: 'Edad', value: row => calculateAge(row.birthDate) },
      { title: 'Escuela', value: row => row.school.name },
      { title: 'Asistencias mínimas (por semana)', value: 'attendance' },
      { title: 'Domicilio', value: row => row.address.address },
      { title: 'Estatus', value: row => (row.active ? 'Activo' : 'No activo') },
      //Datos del grupo
      { title: 'Fecha de incio', value: row => mdy(row.startDate) },
      { title: 'Grupo', value: row => row.group.name },
      { title: 'Turno', value: 'shift' },
      { title: 'Programa de alimentos', value: row => (row.foodProgram ? 'Sí' : 'No') },
      { title: 'Estatura', value: 'height', hidden: row => row.foodProgram === false },
      {
        title: 'Horas de sueño',
        value: 'sleep',
        hidden: row => row.foodProgram === false
      },
      {
        title: 'Actividad fisica que realizas',
        value: 'activities',
        hidden: row => row.foodProgram === false
      },
      {
        title: 'Hábitos alimenticios',
        value: 'feedingHabits',
        hidden: row => row.foodProgram === false
      },
      //Datos de la familia
      { title: 'Nombres(s)', value: row => row.family.map(member => ` ${member.name}`) },
      {
        title: 'Apellido(s)',
        value: row => row.family.map(member => ` ${member.lastName}`)
      },
      {
        title: 'Parentesco',
        value: row => row.family.map(member => ` ${relationship[member.relationship]}`)
      },
      {
        title: 'Estado civil',
        value: row => row.family.map(member => ` ${statusCivil[member.civilStatus]}`)
      },
      {
        title: 'Fecha de nacimiento',
        value: row => row.family.map(member => ` ${mdy(member.birthDate)}`)
      },
      { title: 'Teléfono', value: row => row.family.map(member => ` ${member.phone}`) },
      {
        title: 'Celular',
        value: row => row.family.map(member => ` ${member.cellphone}`)
      },
      {
        title: 'Escolaridad',
        value: row => row.family.map(member => ` ${member.scholarship}`)
      },
      {
        title: 'Ocupación',
        value: row => row.family.map(member => ` ${member.occupation}`)
      },
      {
        title: 'Nombre de la empresa donde labora',
        value: row => row.family.map(member => ` ${member.company}`)
      },
      {
        title: 'Lugar de nacimiento',
        value: row => row.family.map(member => ` ${member.placeBirth}`)
      },
      {
        title: 'Nacionalidad',
        value: row => row.family.map(member => ` ${member.nationality}`)
      },
      //Datos de Seguridad
      {
        title:
          'Autorizo la toma de fotografías y/o video a mi hijo(a) para fines promocionales del club',
        value: row => (row.security.question1 ? 'Sí' : 'No')
      },
      {
        title:
          'Yo (menor) autorizo la toma de fotografías y/o video para fines promocionales del club',
        value: row => (row.security.question2 ? 'Sí' : 'No')
      },
      {
        title: '¿El menor tiene autorización para salir solo del club?',
        value: row => (row.security.question3 ? 'Sí' : 'No')
      },
      {
        title:
          'Personas autorizadas para recoger al menor en caso de no tener autorización de salir solo:',
        value: row =>
          row.security.people.map(p => `${p.name}, ${p.phone} (${p.relationship})`)
      },
      {
        title: '¿Padece alguna enfermedad crónica?',
        value: row => (row.security.question4 ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.security.question4Specific,
        hidden: row => row.security.question4 === false
      },
      {
        title: '¿Está bajo algún tratamiento médico?',
        value: row => (row.security.question5 ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.security.question5Specific,
        hidden: row => row.security.question5 === false
      },
      {
        title: '¿Padece algún tipo de alergia?"',
        value: row => (row.security.question6 ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.security.question6Specific,
        hidden: row => row.security.question6 === false
      },
      {
        title:
          'Autorizo al Club para que a mi hijo se le dé MEDICAMENTO en el caso de que presente malestares en el horario dentro de este Club, asumiendo la responsabilidad en caso de que tenga alguna reacción secundaria',
        value: row => (row.security.question7 ? 'Sí' : 'No')
      },
      {
        title:
          'Autorizo para que en caso de algún accidente en donde sea necesario su traslado se le lleve a una Institución de Servicios Médicos (en caso de emergencia se le avisará a los padres de inmediato)',
        value: row => (row.security.question8 ? 'Sí' : 'No')
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
        data: { reportData, title: 'Socio', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
