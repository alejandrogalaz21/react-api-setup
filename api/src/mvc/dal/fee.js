import Daom from './daom'
import Fee from './../models/fee'
import uuidv4 from 'uuid/v4'
import Partner from './../models/partner'

const fee = new Daom(Fee)
const partner = new Daom(Partner)

const populate = [
  {
    path: 'partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 * @export
 * @returns
 */
export function getAllFee() {
  return fee
    .get()
    .populate(populate)
    .sort({ date: -1, _id: -1 })
}

/**
 * @export
 * @returns
 */
export function getAllPartnerFee(params) {
  const { uuid } = params
  return partner.getOne({ uuid }).then(doc => {
    return fee.get({ partner: doc._id }).populate(populate)
  })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showFee(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return fee.getOne(query).populate(populate)
}

/**
 * @export
 * @param {*} { partner, concept, discount, date, amount, description }
 * @returns {Promise}
 */
export function createFee(payload) {
  const uuid = uuidv4()
  const detail = {
    cause: 'Creación',
    description: 'Nueva cuota agregado'
  }
  const data = { ...payload, uuid, detail: [detail] }
  return fee.create(data).then(doc => fee.getOne({ _id: doc._id }).populate(populate))
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateFee({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return fee.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleFee(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return fee
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return fee.update(query, data).populate(populate)
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
export function destroyFee(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return fee.delete(query)
}

export const model = Fee
