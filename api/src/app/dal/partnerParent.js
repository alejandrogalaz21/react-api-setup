import Daom from './daom'
import PartnerParent from './../models/partnerParent'
import Parent from './../models/partner'

const dao = new Daom(PartnerParent)
const partner = new Daom(Parent)

const populate = [
  {
    path: 'partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 *
 * @export
 * @returns
 */
export function getAllPartnerParent() {
  return dao.get().sort({ _id: -1 }).populate(populate)
}

/**
 * @export
 * @returns
 */
export function getAllPartnerPartner(params) {
  const { uuid } = params
  return partner.getOne({ uuid, active: true }).then(doc => {
    return dao.get({ partner: doc._id }).populate(populate)
  })
}

/**
 *
 * @export
 * @param {*}
 * @returns {Promise}
 */
export function createPartnerParent(payload) {
  const detail = {
    cause: 'Creación',
    description: 'Nuevo miembro de familia del socio agregado'
  }
  const data = { ...payload, detail: [detail] }
  const query = { uuid: data.partnerUuid }
  return partner
    .getOne(query)
    .then(doc => dao.create({ ...data, partner: doc._id }))
    .then(doc => partner.update(query, { $push: { family: doc._id } }))
}

/**
 *
 * @export
 * @param {*} req
 * @returns
 */
export function showPartnerParent(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updatePartnerParent({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function togglePartnerParent(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return dao.update(query, data)
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
export function destroyPartnerParent(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao
    .delete(query)
    .then(doc => partner.update({ _id: doc.partner }, { $pull: { family: doc._id } }))
}

export const model = PartnerParent
