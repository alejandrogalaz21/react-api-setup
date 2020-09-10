import Daom from './daom'
import childInterview from './../models/childInterview'
import uuidv4 from 'uuid/v4'
import Partner from './../models/partner'
import moment from 'moment'

const dao = new Daom(childInterview)
const partner = new Daom(Partner)

const populate = [
  {
    path: 'partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'school' }]
  },
  {
    path: 'user',
    populate: [{ path: 'thumbnail', select: 'path' }]
  }
]

/**
 *
 * @export
 * @returns
 */
export function getAllChildInterview() {
  return dao
    .get()
    .sort({ date: -1, _id: -1 })
    .populate(populate)
}

/**
 * @export
 * @returns
 */
export function getAllPartnerChildInterview(params) {
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
export function showChildInterview(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query).populate(populate)
}

/**
 *
 * @export
 * @param {*} {  }
 * @returns {Promise}
 */
export function createChildInterview(payload) {
  const uuid = uuidv4()
  const detail = {
    cause: 'Creación',
    description: 'Nueva entrevista infantil agregada'
  }
  const data = { ...payload, uuid, detail: [detail] }
  return partner.getOne({ _id: data.partner }).then(partnerDoc => {
    const schoolId = partnerDoc.school
    const age = moment().diff(partnerDoc.birthDate, 'years')
    const address = partnerDoc.address
    const payload = { ...data, schoolId, age, address }
    return dao
      .create(payload)
      .then(doc => dao.getOne({ _id: doc._id }).populate(populate))
  })
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateChildInterview({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleChildInterview(req) {
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
export function destroyChildInterview(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = childInterview
