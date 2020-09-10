import Daom from './daom'
import diagnosticEvaluation from './../models/diagnosticEvaluation'
import uuidv4 from 'uuid/v4'
import Partner from './../models/partner'

const dao = new Daom(diagnosticEvaluation)
const partner = new Daom(Partner)

const populate = [
  {
    path: 'partner',
    populate: [{ path: 'thumbnail', select: 'path' }]
  },
  { path: 'user', populate: [{ path: 'thumbnail', select: 'path' }] }
]

/**
 *
 * @export
 * @returns
 */
export function getAllDiagnosticEvaluation() {
  return dao
    .get()
    .sort({ date: -1, _id: -1 })
    .populate(populate)
}

/**
 * @export
 * @returns
 */
export function getByPartner(params) {
  const { uuid } = params
  return partner.getOne({ uuid }).then(doc => {
    return dao.get({ partner: doc._id }).populate(populate)
  })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showDiagnosticEvaluation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query).populate(populate)
}

/**
 *
 * @export
 * @param {*} { user, date, evaluation, partner }
 * @returns {Promise}
 */
export function createDiagnosticEvaluation(payload) {
  const uuid = uuidv4()
  const detail = {
    cause: 'Creación',
    description: 'Nueva evaluacion diagnostica agregada'
  }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data).then(doc => dao.getOne({ _id: doc._id }).populate(populate))
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateDiagnosticEvaluation({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleDiagnosticEvaluation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }
      // Toggle the parent active property
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
export function destroyDiagnosticEvaluation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = diagnosticEvaluation
