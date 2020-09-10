import Daom from './daom'
import evaluation from './../models/evaluation'
import uuidv4 from 'uuid/v4'

const dao = new Daom(evaluation)

const populate = [
  {
    path: 'position'
  },
  {
    path: 'cycle'
  }
]

/**
 *
 * @export
 * @returns
 */
export function getAllEvaluation() {
  return dao
    .get()
    .sort({ _id: -1 })
    .populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showEvaluation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query).populate(populate)
}

/**
 *
 * @export
 * @param {*} { name }
 * @returns {Promise}
 */
export function createEvaluation(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nueva evaluación agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateEvaluation({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleEvaluation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return dao.update(query, data).populate(populate)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function destroyEvaluation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = evaluation
