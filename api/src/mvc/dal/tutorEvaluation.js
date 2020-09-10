import Daom from './daom'
import TutorEvaluation from './../models/tutorEvaluation'

const tutorEvaluation = new Daom(TutorEvaluation)

const populate = [
  {
    path: 'user',
    populate: [{ path: 'thumbnail', select: 'path' }]
  },
  {
    path: 'position'
  }
]

/**
 * @params  none
 * @desc    retrieve all records
 */
export function getAllTutorEvaluation() {
  return tutorEvaluation
    .get()
    .populate(populate)
    .sort({ _id: -1 })
}

/**
 * @params  params
 * @desc    retrieve just one record
 */
export function showTutorEvaluation(params) {
  const uuid = params.uuid
  const query = { uuid }
  return tutorEvaluation.getOne(query).populate(populate)
}

/**
 * @params  payload
 * @desc    create a new record
 */
export function createTutorEvaluation(payload) {
  // const detail = {
  //   cause: 'Creación',
  //   description: 'Nueva evaluación a tutor agregada'
  // }
  // const data = { ...payload, detail: [detail] }
  return tutorEvaluation.create(payload)
}

/**
 * @params  params, request
 * @desc    update a single record
 */
export function updateTutorEvaluation(params, request) {
  const { uuid } = params
  const { payload, detail } = request
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return tutorEvaluation.update(query, data).populate(populate)
}

/**
 * @params  payload
 * @desc    toggle the active property of a record
 */
export function toggleTutorEvaluation(params, payload) {
  const uuid = params.uuid
  const { detail } = payload
  const query = { uuid }

  return tutorEvaluation
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return tutorEvaluation.update(query, data).populate(populate)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @params  params
 * @desc    retrieve all records
 */
export function destroyTutorEvaluation(params) {
  const uuid = params.uuid
  const query = { uuid }
  return tutorEvaluation.delete(query)
}

export const model = TutorEvaluation
