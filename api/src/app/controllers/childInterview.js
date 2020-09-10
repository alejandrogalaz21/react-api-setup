import ChildInterview from './../models/childInterview'
import Partner from './../models/partner'
import { childInterviewSaveValidation } from './../validation/childInterview'
import pagination from '../../util/pagination'
import moment from 'moment'
import jsreport from 'jsreport'
import { downloadReportAndDelete } from './../../util/bufferReport'
import { mdy, calculateAge } from './../../util/dates'
import { getDetail } from './../../util/reports'
import { getChildInterview } from '../queries/childInterview.report'

const populate = [
  {
    path: 'partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'school' }]
  },
  {
    path: 'user',
    select: 'name lastName fullName uuid _id thumbnail',
    populate: [{ path: 'thumbnail', select: 'path' }]
  },
  { path: 'institution', select: 'name code' }
]

// Retrieve all documents in the collection
export const index = async (req, res, next) => {
  try {
    let payload = await ChildInterview.find(req.filterQuery)
      .sort({ updateAt: -1 })
      .select(
        'active createdAt created_by date detail partner user updatedAt updated_by uuid institution _id'
      )
      .populate(populate)
      .populate('detail.created_by', 'name lastName')
      .lean()

    if (req.query.page && req.query.size) {
      payload = await pagination(ChildInterview)(req.query)
    }
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Retrieve all documents filtered by one partner
export const getAllPartnerChildInterview = async (req, res) => {
  try {
    const { institution } = req.filterQuery
    const query = institution ? { institution } : {}

    const partner = await Partner.findOne({ uuid: req.params.uuid })
    const result = await ChildInterview.find({ partner: partner._id, ...query })
      .sort({ updateAt: -1 })
      .select(
        'active createdAt created_by date detail partner user updatedAt updated_by uuid institution _id'
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
    const result = await ChildInterview.findOne(req.filterQuery)
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

    const validate = await childInterviewSaveValidation(ChildInterview)(request)
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
    const payload = { ...data, institution: partnerDoc.institution, schoolId, age, address }
    const result = await ChildInterview.create(payload).then(doc =>
      ChildInterview.findOne({ _id: doc._id }).populate(populate)
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
    const validate = await childInterviewSaveValidation(ChildInterview)(
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

    const validate = await childInterviewSaveValidation(ChildInterview)(
      payload,
      query.uuid
    )
    if (!validate.isValid) return res.status(400).json(validate)

    detail.created_by = updated_by
    const data = { ...payload, updated_by, $push: { detail } }
    const result = await ChildInterview.findOneAndUpdate(query, data, {
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

    const { active } = await ChildInterview.findOne(query)
    const data = { active: !active, updated_by, $push: { detail } }
    const result = await ChildInterview.findOneAndUpdate(query, data, { new: true })

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
    const result = await ChildInterview.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// this method download the PDF report individual
export const exportPdfReportDetail = async (req, res) => {
  try {
    const data = await getChildInterview(req.params, populate)
    const columns = [
      //Datos de entrrevista
      { title: 'Entrevistador', value: row => row.user.fullName },
      { title: 'Fecha de entrevista', value: row => mdy(row.date) },
      { title: 'Observaciones', value: 'observations' },
      //Datos del socio
      { title: 'Socio', value: row => row.partner.fullName },
      { title: 'Dirección', value: row => row.address.address },
      { title: 'Fecha de nacimiento', value: row => mdy(row.partner.birthDate) },
      { title: 'Edad', value: row => calculateAge(row.partner.birthDate) },
      { title: 'Género', value: row => row.partner.genre },
      { title: 'Lateralidad', value: row => row.identification.laterality },
      {
        title: '¿Por qué aceptaste inscribirte al Club?',
        value: row => row.identification.inscription
      },
      //Medio Familiar
      { title: '¿Con quién vives?', value: row => row.family.life },
      { title: '¿Cuántos y quiénes son en tu casa?', value: row => row.family.cant },
      {
        title: '¿Cómo te llevas con tus hermanos?',
        value: row => row.family.relationship
      },
      {
        title: '¿Cómo es tu casa?',
        value: row => row.family.home
      },
      //Medio escolar
      { title: '¿A qué escuela vas?', value: row => row.partner.school.name },
      { title: '¿En qué año estas?', value: row => row.school.year },
      { title: '¿En qué turno?', value: row => row.school.turn },
      { title: '¿Cómo se llama tu maestro(a)?', value: row => row.school.tutorName },
      { title: '¿Cómo es?', value: row => row.school.tutorDescription },
      {
        title: '¿Cómo es tu relación con el(ella)?',
        value: row => row.school.tutorRelationship
      },
      { title: '¿Tienes amigos en la escuela?', value: row => row.school.friends },
      { title: '¿Quiénes son?', value: row => row.school.whoFriends },
      {
        title: '¿Cómo te llevas con ellos?',
        value: row => row.school.friendsRelationship
      },
      { title: '¿Qué haces con ellos?', value: row => row.school.friendsAct },
      //Disciplina
      { title: '¿Quién te castiga?', value: row => row.discipline.whoPunishment },
      { title: '¿Por qué te castigan?', value: row => row.discipline.whyPunishment },
      { title: '¿Cómo te castigan?', value: row => row.discipline.howPunishment },
      {
        title: '¿Y tú qué haces cuando te castigan?',
        value: row => row.discipline.doPunishment
      },
      { title: '¿Cómo te sientes?', value: row => row.discipline.fellPunishment },
      //Emociones
      { title: '¿Qué es lo peor que te ha pasado?', value: row => row.emotions.worst },
      { title: '¿Qué es lo mejor que te ha pasado?', value: row => row.emotions.best },
      { title: '¿Qué te pone triste?', value: row => row.emotions.sad },
      { title: '¿Qué te pone contento?', value: row => row.emotions.happy },
      { title: '¿Qué es lo que te enoja?', value: row => row.emotions.angry },
      //Que haces cuando
      { title: 'Te enojas', value: row => row.emotions.whatDo.angry },
      { title: 'Estas triste', value: row => row.emotions.whatDo.sad },
      { title: 'Estas contento', value: row => row.emotions.whatDo.happy },
      //Ideales
      { title: '¿Qué te gustaría ser de grande?', value: row => row.ideal.big },
      { title: '¿Por qué?', value: row => row.ideal.justificationBig },
      { title: '¿Qué te gustaría ser ahorita?', value: row => row.ideal.now },
      { title: '¿Por qué?', value: row => row.ideal.justificationNow },
      { title: '¿Qué edad te gustaría tener?', value: row => row.ideal.desiredAge },
      { title: '¿Por qué?', value: row => row.ideal.justificationAge },
      {
        title: 'Si pudieras cambiar algo de tus papás, ¿Qué cambiarías?',
        value: row => row.ideal.changeParents
      },
      { title: '¿Por qué?', value: row => row.ideal.justificationParents },
      {
        title: '¿Qué te gustaría cambiar de tu casa?',
        value: row => row.ideal.changeHome
      },
      { title: '¿Por qué?', value: row => row.ideal.justificationHome },
      //Gustos e intereses
      {
        title: '¿Qué te gusta hacer en tus tiempos libres?',
        value: row => row.interests.freeTime
      },
      //Deportes
      {
        title: '¿Has pertenecido a algún equipo deportivo?',
        value: row => row.interests.sports.sportsTeam
      },
      { title: '¿Dónde?', value: row => row.interests.sports.where },
      {
        title: 'Menciona los deportes que conoces',
        value: row => row.interests.sports.knownSports
      },
      {
        title: 'Menciona los deportes que has practicado',
        value: row => row.interests.sports.practisedSports
      },
      { title: '¿Dónde?', value: row => row.interests.sports.wherePractised },
      {
        title: '¿Qué deportes te gustaría conocer y/o practicar?',
        value: row => row.interests.sports.likeSports
      },
      { title: '¿Por qué?', value: row => row.interests.sports.justification },
      {
        title: '¿Qué esperas obtener de tus clases de deportes?',
        value: row => row.interests.sports.sportsClasses
      },
      //Artes
      {
        title: 'Define con tus palabras que es ARTE',
        value: row => row.interests.arts.description
      },
      {
        title: 'De las siguientes opciones ¿Cuáles son las que ya conoces?',
        value: row => row.interests.arts.optons
      },
      {
        title: '¿Qué tipo de manualidades has realizado?',
        value: row => row.interests.arts.crafts
      },
      {
        title: '¿Sabes que es el origami?',
        value: row => (row.interests.arts.origami ? 'Sí' : 'No')
      },
      { title: '¿Qué es?', value: row => row.interests.arts.origamiDescription },
      {
        title: 'Menciona los instrumentos musicales que conoces',
        value: row => row.interests.arts.musicalInstruments
      },
      {
        title: 'De los siguientes instrumentos, ¿Cuál te gustaría aprender a tocar?',
        value: row => row.interests.arts.optionsInstruments
      },
      {
        title: '¿Te gustaría poder llegar a exponer tus trabajos de pintura?',
        value: row => (row.interests.arts.paitingWork ? 'Sí' : 'No')
      },
      { title: '¿Por qué?', value: row => row.interests.arts.justification },
      {
        title: '¿Qué esperarías obtener de tus clases de artes?',
        value: row => row.interests.arts.artsClasses
      },
      //Educacion
      {
        title: '¿Cuál es la materia que te gusta más?',
        value: row => row.interests.education.bestSubject
      },
      { title: '¿Por qué?', value: row => row.interests.education.justificationBest },
      {
        title: '¿Cuál es la materia que se te dificulta?',
        value: row => row.interests.education.worstSubject
      },
      { title: '¿Por qué?', value: row => row.interests.education.justificationWorst },
      {
        title: 'En cuál de las siguientes actividades te gustaría involucrarte',
        value: row => row.interests.education.activities
      },
      {
        title: '¿Qué esperas obtener de tus clases de educación?',
        value: row => row.interests.education.educationClasses
      },
      //Desarrollo Humano
      {
        title: '¿A qué crees que se refiera las palabras “Desarrollo humano”?',
        value: row => row.interests.humanDev.humanDev
      },
      {
        title: '¿Conoces tus derechos como niño?',
        value: row => row.interests.humanDev.childRights
      },
      {
        title: 'Menciona algunos',
        value: row => row.interests.humanDev.justificationRights
      },
      {
        title: '¿Con quién platicas de lo que sientes?',
        value: row => row.interests.humanDev.feel
      },
      {
        title: 'De las siguientes opciones, ¿cuál te llama más la atención?',
        value: row => row.interests.humanDev.attention
      },
      {
        title: '¿Por qué?',
        value: row => row.interests.humanDev.justificationAttention
      },
      {
        title: '¿Conoces y/o practicas el reciclaje?',
        value: row => row.interests.humanDev.recycling
      },
      {
        title: 'Qué esperas de tus clases de Desarrollo Humano',
        value: row => row.interests.humanDev.humanDevClasses
      },
      //Banco de alimentos
      {
        title: '¿Cuántas comidas realizas en el día?',
        value: row => row.interests.foodBank.foods
      },
      { title: '¿Qué desayunas?', value: row => row.interests.foodBank.breakfast },
      {
        title: '¿Cuántos vasos de agua natural tomas al día?',
        value: row => row.interests.foodBank.glassesWater
      },
      {
        title: '¿Comes frutas y verduras?',
        value: row => row.interests.foodBank.fruitsVegetables
      },
      { title: '¿Cuáles?', value: row => row.interests.foodBank.justification },
      //Deseos
      {
        title:
          'Si estuvieras un hada madrina y te dijera que tienes 3 deseos, ¿Qué pedirías?',
        value: row => row.wishes.wishes
      },
      {
        title: 'Si estuvieras solo en una isla, ¿Con quién te gustaría estar?',
        value: row => row.wishes.companion
      },
      { title: '¿Por qué?', value: row => row.wishes.justification }
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
        data: { reportData, title: 'Entrevista Infantil ', type: 'detail' }
      })
      .then(async buffer => downloadReportAndDelete(res, buffer))
      .catch(error => console.log(error))
  } catch (error) {
    console.log(error)
    return res.status(500).json(JSON.stringify(error, '', 2))
  }
}
