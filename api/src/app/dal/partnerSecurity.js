import Daom from './daom'
import PartnerSecurity from './../models/partnerSecurity'

const dao = new Daom(PartnerSecurity)

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
export function getAllPartnerSecurity() {
  return dao
    .get()
    .sort({ _id: -1 })
    .populate(populate)
}

/**
 *
 * @export
 * @param {*}
 * @returns {Promise}
 */
export function createPartnerSecurity(payload) {
  const detail = {
    cause: 'Creación',
    description: 'Nuevo registro de seguridad de socio agregado'
  }
  const data = { ...payload, detail: [detail] }
  return dao.create(data)
}

/**
 *
 * @export
 * @param {*} req
 * @returns
 */
export function showPartnerSecurity(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updatePartnerSecurity({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function togglePartnerSecurity(req) {
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
export function destroyPartnerSecurity(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = PartnerSecurity
