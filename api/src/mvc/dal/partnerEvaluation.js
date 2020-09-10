import Daom from './daom'
import PartnerEvaluation from './../models/partnerEvaluation'
import Schedule from './../models/schedule'
import Programming from './../models/programming'
import Partner from './../models/partner'
import AssignmentTutor from './../models/assignmentTutor'
import { isEmpty } from './../../util'

const partnerEvaluation = new Daom(PartnerEvaluation)
const schedule = new Daom(Schedule)
const programming = new Daom(Programming)
const partner = new Daom(Partner)
const assignmentTutor = new Daom(AssignmentTutor)

const populate = [
  {
    path: 'partner user',
    populate: [
      { path: 'thumbnail', select: 'path' },
      { path: 'position' },
      { path: 'group' }
    ]
  },
  {
    path: 'group cycle assignmentTutor'
  },
  {
    path: 'program',
    populate: 'areas'
  }
]

/**
 * @params  none
 * @desc    retrieve all records
 */
export function getAllPartnerEvaluation() {
  return partnerEvaluation
    .get()
    .populate(populate)
    .sort({ _id: -1 })
}

/**
 * @params  { uuid }
 * @returns retrieve documents by partner
 */
export function getByPartner({ uuid }) {
  return partner.getOne({ uuid }).then(doc => {
    return partnerEvaluation.get({ partner: doc._id }).populate(populate)
  })
}

/**
 * @params  params
 * @desc    retrieve just one record
 */
export function showPartnerEvaluation(params) {
  const uuid = params.uuid
  const query = { uuid }
  return partnerEvaluation.getOne(query).populate(populate)
}

/**
 * @params  payload
 * @desc    create a new record
 */
export function createPartnerEvaluation(payload) {
  return partnerEvaluation.create(payload).then(doc => {
    return assignmentTutor
      .update({ _id: doc[0].assignmentTutor }, { evaluated: true })
      .then(() => doc)
  })
}

/**
 * @params  params, request
 * @desc    update a single record
 */
export function updatePartnerEvaluation(params, request) {
  const { uuid } = params
  const { payload, detail } = request
  const data = { ...payload, $push: { detail } }
  return partnerEvaluation.update({ uuid }, data).populate(populate)
}

export async function getPartnerEvaluationPartners(payload) {
  const tutorProgram = await assignmentTutor
    .getOne({ user: payload.user, evaluated: false })
    .populate({ path: 'program', populate: 'areas' })
    .populate('user')

  if (!isEmpty(tutorProgram)) {
    const sched = await schedule.getOne({
      assignmentTutor: { $in: payload.assignmentTutor }
    })
    const programm = await programming
      .getOne({ schedule: sched, cycle: payload.cycle })
      .populate('cycle group')
    const partners = await partner
      .get({ group: programm.group, status: 1 })
      .populate('thumbnail', 'path')

    return {
      partners,
      programming: programm,
      assignmentTutor: tutorProgram
    }
  }
}

/**
 * @params  payload
 * @desc    toggle the active property of a record
 */
export function togglePartnerEvaluation(params, payload) {
  const uuid = params.uuid
  const { detail } = payload
  const query = { uuid }

  return partnerEvaluation
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return partnerEvaluation.update(query, data).populate(populate)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @params  params
 * @desc    retrieve all records
 */
export function destroyPartnerEvaluation(params) {
  const uuid = params.uuid
  const query = { uuid }
  return partnerEvaluation.delete(query)
}

export const model = PartnerEvaluation
