import moment from 'moment'
import jsreport from 'jsreport'
import Partner from './../models/partner'
import FamilyInterview from './../models/familyInterview'
import pagination from './../../util/pagination'
import { getDetail } from './../../util/reports'
import { mdy, calculateAge } from './../../util/dates'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { getfamilyInterview } from './../queries/familyInterview}.report'
import { familyInterviewSaveValidation } from './../validation/familyInterview'

const populate = [
  {
    path: 'partner',
    populate: [
      { path: 'thumbnail', select: 'path' },
      { path: 'school' },
      { path: 'group' },
      { path: 'family' },
      { path: 'security' }
    ]
  },
  {
    path: 'user',
    populate: [{ path: 'thumbnail', select: 'path' }]
  },
  { path: 'institution', select: 'name code' }
]

// Retrieve all documents in the collection
export const index = async (req, res, next) => {
  try {
    let payload = await FamilyInterview.find(req.filterQuery)
      .sort({ updateAt: -1 })
      .select(
        'active createdAt created_by date detail partner updatedAt updated_by user uuid institution _id'
      )
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
    if (req.query.page && req.query.size) {
      payload = await pagination(FamilyInterview)(req.query)
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
    const result = await FamilyInterview.find({ partner: partner._id, ...query })
      .sort({ updateAt: -1 })
      .select(
        'active createdAt created_by date detail partner updatedAt updated_by user uuid institution _id'
      )
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Retrieve a single document in the collection
export const show = async (req, res, next) => {
  try {
    const result = await FamilyInterview.findOne(req.filterQuery)
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
export const create = async (req, res, next) => {
  try {
    const created_by = req.user._id
    let request = { ...req.body, created_by }

    const validate = await familyInterviewSaveValidation(FamilyInterview)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const detail = {
      cause: 'Creación',
      description: 'Nuevo registro agregado',
      created_by
    }

    const data = { ...request, detail: [detail] }
    const partnerDoc = await Partner.findOne({ _id: data.partner })

    const schoolId = partnerDoc.school
    const age = moment().diff(partnerDoc.birthDate, 'years')
    const address = partnerDoc.address
    const payload = {
      ...data,
      institution: partnerDoc.institution,
      schoolId,
      age,
      address
    }
    const result = await FamilyInterview.create(payload).then(doc =>
      FamilyInterview.findOne({ _id: doc._id }).populate(populate)
    )

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Validate POST and PUT request before sending those requests
export const validate = async (req, res, next) => {
  try {
    const request = req.body
    const validate = await familyInterviewSaveValidation(FamilyInterview)(
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

    const validate = await familyInterviewSaveValidation(FamilyInterview)(
      payload,
      query.uuid
    )
    if (!validate.isValid) return res.status(400).json(validate)

    detail.created_by = updated_by
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await FamilyInterview.findOneAndUpdate(query, data, {
      new: true
    }).populate(populate)

    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Logical deletion based on the active property
export const toggle = async (req, res, next) => {
  try {
    const updated_by = req.user._id
    const query = { uuid: req.params.uuid }
    const detail = { ...req.body.detail, created_by: updated_by }

    const { active } = await FamilyInterview.findOne(query)
    const data = { active: !active, updated_by, $push: { detail } }
    const result = await FamilyInterview.findOneAndUpdate(query, data, { new: true })

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
export const destroy = async (req, res, next) => {
  try {
    const query = { uuid: req.params.uuid }
    const result = await FamilyInterview.findOneAndUpdate(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
  try {
    const partnerStatus = ['Nuevo', 'Activo', 'Baja', 'Egresado']
    const relationship = ['Padre', 'Madre', 'Tutor']
    const statusCivil = ['Soltero', 'Casado', 'Viudo', 'Unión libre', 'Divorciado']

    const data = await getfamilyInterview(req.params, populate)
    const columns = [
      //Datos de entrrevista
      { title: 'Entrevistador', value: row => row.user.fullName },
      { title: 'Fecha de entrevista', value: row => mdy(row.date) },
      { title: 'Observaciones', value: 'observation' },
      //Datos Personales
      { title: 'Socio', value: row => row.partner.fullName },
      { title: 'Dirección', value: row => row.partner.address.address },
      { title: 'Fecha de nacimiento', value: row => mdy(row.partner.birthDate) },
      { title: 'Edad', value: row => calculateAge(row.partner.birthDate) },
      { title: 'Tipo de Socio', value: row => partnerStatus[row.partner.status] },
      { title: 'Género', value: row => row.partner.genre },
      { title: 'Estatura', value: 'height' },
      { title: 'Peso', value: 'weight' },
      { title: 'Nombre de la escuela', value: row => row.partner.school.name },
      { title: 'Turno', value: row => row.partner.shift },
      {
        title: 'Grupo',
        value: row => row.partner.group.name
      },
      { title: 'Grado', value: row => row.partner.school.grade },
      //Datos Familiares
      {
        title: 'Nombres(s)',
        value: row => row.partner.family.map(member => ` ${member.name}`)
      },
      {
        title: 'Apellido(s)',
        value: row => row.partner.family.map(member => ` ${member.lastName}`)
      },
      {
        title: 'Parentesco',
        value: row =>
          row.partner.family.map(member => ` ${relationship[member.relationship]}`)
      },
      {
        title: 'Estado civil',
        value: row =>
          row.partner.family.map(member => ` ${statusCivil[member.civilStatus]}`)
      },
      {
        title: 'Fecha de nacimiento',
        value: row => row.partner.family.map(member => ` ${mdy(member.birthDate)}`)
      },
      {
        title: 'Teléfono',
        value: row => row.partner.family.map(member => ` ${member.phone}`)
      },
      {
        title: 'Celular',
        value: row => row.partner.family.map(member => ` ${member.cellphone}`)
      },
      {
        title: 'Escolaridad',
        value: row => row.partner.family.map(member => ` ${member.scholarship}`)
      },
      {
        title: 'Ocupación',
        value: row => row.partner.family.map(member => ` ${member.occupation}`)
      },
      {
        title: 'Nombre de la empresa donde labora',
        value: row => row.partner.family.map(member => ` ${member.company}`)
      },
      {
        title: 'Lugar de nacimiento',
        value: row => row.partner.family.map(member => ` ${member.placeBirth}`)
      },
      {
        title: 'Nacionalidad',
        value: row => row.partner.family.map(member => ` ${member.nationality}`)
      },
      //Historia clinica
      { title: 'Gateo', value: row => row.clinic.crawl },
      { title: 'Camino', value: row => row.clinic.way },
      { title: 'Empezó a hablar', value: row => row.clinic.speaks },
      { title: 'Controló esfínteres', value: row => row.clinic.sphincters },
      { title: 'Se vistió completamente', value: row => row.clinic.wear },
      {
        title: 'Algún familiar ha presentado problemas de',
        value: row => row.clinic.problems.join(',')
      },
      {
        title: 'Durante el desarrollo hubo algo anormal como',
        value: row => row.clinic.devAbnormal.join(',')
      },
      {
        title: 'Enfermedades que ha padecido',
        value: row => row.clinic.disease.join(',')
      },
      {
        title: '¿Padece alguna enfermedad crónica?',
        value: row => (row.clinic.chronicle ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.clinic.justification,
        hidden: row => row.clinic.chronicle === false
      },
      {
        title: '¿Está bajo algún tratamiento médico?',
        value: row => (row.clinic.treatment ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.clinic.justification2,
        hidden: row => row.clinic.treatment === false
      },
      {
        title: '¿Padece algún tipo de alergia?"',
        value: row => (row.clinic.allergy ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.clinic.justification3,
        hidden: row => row.clinic.allergy === false
      },
      {
        title: 'El menor cuenta con alguno de estos servicios médicos',
        value: row => row.clinic.secure.join(',')
      },
      { title: 'Otro', value: row => (row.clinic.other ? 'Sí' : 'No') },
      {
        title: 'Especifique',
        value: row => row.clinic.justification4,
        hidden: row => row.clinic.other === false
      },
      { title: 'Del oído', value: row => (row.clinic.ear ? 'Sí' : 'No') },
      {
        title: '¿En dondé?',
        value: row => row.clinic.justification5,
        hidden: row => row.clinic.ear === false
      },
      {
        title: '¿En que fecha?',
        value: row => mdy(row.clinic.date),
        hidden: row => row.clinic.ear === false
      },
      { title: 'De la vista', value: row => (row.clinic.view ? 'Sí' : 'No') },
      {
        title: '¿En dondé?',
        value: row => row.clinic.justification6,
        hidden: row => row.clinic.view === false
      },
      {
        title: '¿En que fecha?',
        value: row => mdy(row.clinic.date2),
        hidden: row => row.clinic.view === false
      },
      { title: 'Neurológico', value: row => (row.clinic.neurological ? 'Sí' : 'No') },
      {
        title: '¿En dondé?',
        value: row => row.clinic.justification7,
        hidden: row => row.clinic.neurological === false
      },
      {
        title: '¿En que fecha?',
        value: row => mdy(row.clinic.date3),
        hidden: row => row.clinic.neurological === false
      },
      { title: 'Psicológico', value: row => (row.clinic.psychologic ? 'Sí' : 'No') },
      {
        title: '¿En dondé?',
        value: row => row.clinic.justification8,
        hidden: row => row.clinic.psychologic === false
      },
      {
        title: '¿En que fecha?',
        value: row => mdy(row.clinic.date4),
        hidden: row => row.clinic.psychologic === false
      },
      { title: 'Otro', value: row => (row.clinic.other2 ? 'Sí' : 'No') },
      {
        title: '¿En dondé?',
        value: row => row.clinic.justification9,
        hidden: row => row.clinic.other2 === false
      },
      {
        title: '¿En que fecha?',
        value: row => mdy(row.clinic.date5),
        hidden: row => row.clinic.other2 === false
      },
      {
        title: 'Ha recibido atención especial anteriormente',
        value: row => row.clinic.attention.join(',')
      },
      { title: 'Otro', value: row => row.clinic.other3 },
      {
        title:
          'Autorizo al Club para que a mi hijo se le dé “MEDICAMENTO” si llega a presentar malestares en el horario dentro de este Club, asumiendo la responsabilidad en caso de que tenga alguna reacción secundaria',
        value: row => row.clinic.medicine
      },
      {
        title:
          'Autorizo para que en caso de algún accidente en donde sea necesario su traslado se le lleve a una institución de Servicios Médicos (en caso de emergencia se le avisará a los padres de inmediato)',
        value: row => row.clinic.accident
      },
      //Historia Escolar
      { title: 'Guardería', value: row => (row.school.kindergarten ? 'Sí' : 'No') },
      {
        title: 'Edad a la que ingresó',
        value: row => row.school.age,
        hidden: row => row.school.kindergarten === false
      },
      { title: 'Kinder', value: row => (row.school.kinder ? 'Sí' : 'No') },
      {
        title: 'Edad a la que ingresó',
        value: row => row.school.age2,
        hidden: row => row.school.kinder === false
      },
      { title: 'Primaria', value: row => (row.school.primary ? 'Sí' : 'No') },
      {
        title: 'Edad a la que ingresó',
        value: row => row.school.age3,
        hidden: row => row.school.primary === false
      },
      {
        title: 'En caso de no asistir a la escuela, especificar porqué',
        value: row => row.school.absent
      },
      {
        title: '¿Lo (la) han cambiado de escuela?',
        value: row => (row.school.changeSchool ? 'Sí' : 'No')
      },
      {
        title: '¿Cuántas veces y por qué?',
        value: row => row.school.cant,
        hidden: row => row.school.changeSchool === false
      },
      {
        title: '¿Ha reprobado o repetido algún grado?',
        value: row => (row.school.repeated ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.school.justification,
        hidden: row => row.school.repeated === false
      },
      {
        title: '¿Cuántas veces y por qué?',
        value: row => row.school.cant2,
        hidden: row => row.school.repeated === false
      },
      {
        title: 'En la escuela ¿han reportado algún problema?',
        value: row => (row.school.problem ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.school.justification2,
        hidden: row => row.school.problem === false
      },
      {
        title:
          'En la escuela, ¿solicitaron o sugirieron la necesidad de que este niño (a) reciba ayuda?',
        value: row => (row.school.help ? 'Sí' : 'No')
      },
      {
        title: '¿De qué tipo?',
        value: row => row.school.justification3,
        hidden: row => row.school.help === false
      },
      {
        title: 'Promedio de calificaciones del niño (a)',
        value: row => row.school.prom
      },
      //Contexto emocional del menor
      { title: 'Su hijo es', value: row => row.emotional.son },
      {
        title: 'Edad de la madre al casarse',
        value: row => row.emotional.ageMotherMarried
      },
      {
        title: 'Edad del padre al casarse',
        value: row => row.emotional.ageFatherMarried
      },
      { title: 'Edad de la madre', value: row => row.emotional.ageMother },
      { title: 'Edad del padre', value: row => row.emotional.ageFather },
      { title: 'Divorcio', value: row => (row.emotional.divorce ? 'Sí' : 'No') },
      {
        title: 'Motivo del divorcio',
        value: row => row.emotional.reasonDivorce,
        hidden: row => row.emotional.divorce === false
      },
      { title: 'Padre alcohólico', value: row => row.emotional.alcoholicFather },
      { title: 'Madre alcohólica', value: row => row.emotional.alcoholicMother },
      { title: 'Contexto del niño', value: row => row.emotional.contextSon.join(',') },
      {
        title: 'Hace todo lo que quiere y se le permite todo',
        value: row => row.emotional.permitted
      },
      {
        title: 'Tiene alguna obligación en casa',
        value: row => (row.emotional.obligation ? 'Sí' : 'No')
      },
      {
        title: '¿Cuál?',
        value: row => row.emotional.justification,
        hidden: row => row.emotional.obligation === false
      },
      { title: 'Es obediente', value: row => (row.emotional.obedient ? 'Sí' : 'No') },
      {
        title: '¿A quién obedece mejor en la casa?',
        value: row => row.emotional.homeObedient,
        hidden: row => row.emotional.obedient === false
      },
      {
        title: '¿En la escuela?',
        value: row => row.emotional.schoolObedient,
        hidden: row => row.emotional.obedient === false
      },
      {
        title: 'Métodos disciplinarios empleados con el niño (a) y por quién',
        value: row => row.emotional.methods
      },
      {
        title: '¿En qué ocasiones y porque motivos hace berrinches?',
        value: row => row.emotional.son
      },
      { title: '¿Cómo?', value: row => row.emotional.tantrums },
      //Hobbies
      {
        title: '¿Qué actividades realiza en su tiempo libre?',
        value: row => row.hobbies.freeTime.join(',')
      },
      { title: 'Otro', value: row => row.hobbies.other },
      {
        title: '¿Qué lugares de entretenimiento o diversión acostumbran visitar?',
        value: row => row.hobbies.entertainment
      },
      {
        title: '¿Qué actividades realizan cuando están en familia?',
        value: row => row.hobbies.activities
      },
      { title: 'Desarrollo humano', value: row => row.hobbies.areas.humanDev.join(',') },
      { title: 'Artes', value: row => row.hobbies.areas.arts.join(',') },
      { title: 'Educación', value: row => row.hobbies.areas.education.join(',') },
      { title: 'Deportes', value: row => row.hobbies.areas.sports.join(',') },
      //Socioeconomics
      {
        title: 'Nombre(s)',
        value: row => row.socioeconomic.members.map(m => `${m.name}`)
      },
      { title: 'Edad', value: row => row.socioeconomic.members.map(m => `${m.age}`) },
      {
        title: 'Parentesco',
        value: row => row.socioeconomic.members.map(m => `${m.relationship}`)
      },
      {
        title: 'Estado civil',
        value: row => row.socioeconomic.members.map(m => `${statusCivil[m.civilStatus]}`)
      },
      {
        title: 'Escolaridad',
        value: row => row.socioeconomic.members.map(m => `${m.scholarship}`)
      },
      {
        title: 'Ocupación',
        value: row => row.socioeconomic.members.map(m => `${m.occupation}`)
      },
      { title: 'Los ingresos provienen de', value: row => row.socioeconomic.income },
      {
        title: 'Ingresos familiares mensuales',
        value: row => row.socioeconomic.monthly
      },
      {
        title: 'La casa donde viven actualmente es',
        value: row => row.socioeconomic.home
      },
      {
        title: '¿Cuántas comidas realizas en el día?',
        value: row => row.foodBank.foods
      },
      { title: '¿Qué desayunas en casa?', value: row => row.foodBank.breakfast },
      {
        title: '¿Comes frutas y verduras en casa?',
        value: row => (row.foodBank.fruitsVegetables ? 'Sí' : 'No')
      },
      {
        title: '¿Cuáles?',
        value: row => row.foodBank.justification,
        hidden: row => row.foodBank.fruitsVegetables === false
      },
      {
        title: '¿Conoces los derechos humanos?',
        value: row => (row.humanRights.rights ? 'Sí' : 'No')
      },
      {
        title: '¿Cómo cuáles?',
        value: row => row.humanRights.justification,
        hidden: row => row.humanRights.rights === false
      },
      {
        title: '¿Conoce los derechos de las niñas, niños, adolescentes y jóvenes?',
        value: row => (row.humanRights.moreRights ? 'Sí' : 'No')
      },
      {
        title: '¿Cómo cuáles?',
        value: row => row.humanRights.justification2,
        hidden: row => row.humanRights.moreRights === false
      },
      //Security
      {
        title:
          'Autorizo la toma de fotografías y/o video a mi hijo(a) para fines promocionales del club',
        value: row => (row.security.question1 ? 'Sí' : 'No')
      },
      {
        title: '¿El menor tiene autorización para salir solo del club?',
        value: row => (row.security.question2 ? 'Sí' : 'No')
      },
      {
        title: 'Antes y después de clases ¿Quién se encarga de cuidar al menor?',
        value: row => row.security.chargePerson
      },
      {
        title: '¿En que se trasladaría el menor al club?',
        value: row => row.security.transfer
      },
      { title: '¿Qué persona lo acompañaría?', value: row => row.security.companion },
      {
        title: 'Nombre(s)',
        value: row => row.security.authorized.map(a => `${a.name}`)
      },
      {
        title: 'Teléfono',
        value: row => row.security.authorized.map(a => `${a.phone}`)
      },
      {
        title: 'Parentesco',
        value: row => row.security.authorized.map(a => `${a.relationship}`)
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
        data: { reportData, title: 'Entrevista Familiar', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
