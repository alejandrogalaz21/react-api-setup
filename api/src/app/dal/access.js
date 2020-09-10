import uuidv4 from 'uuid/v4'
import moment from 'moment'
import requestIp from 'request-ip'
import geoip from 'geoip-lite'
import Daom from './daom'
import Access from '../models/access'
import Partner from '../models/partner'

const access = new Daom(Access)
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
export function getAllAccess() {
  return access
    .get()
    .sort({ date: -1 })
    .populate(populate)
}

/**
 * @export
 * @returns
 */
export function getAllAccessPartner(params) {
  const { uuid } = params
  return partner.getOne({ uuid }).then(doc => {
    return access
      .get({ partner: doc._id })
      .sort({ date: -1 })
      .populate(populate)
  })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showAccess(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return access
    .getOne(query)
    .populate(populate)
    .populate('partner.security')
}
/**
 * @export
 * @param {*} req
 * @returns
 */
export function getTypeAccess(req) {
  const today = moment().startOf('day')
  const params = req.params
  return partner
    .getOne({ uuid: params.partnerUuid })
    .then(partnerId => {
      const query = {
        partner: partnerId,
        date: {
          $gte: today.toDate(),
          $lte: moment(today)
            .endOf('day')
            .toDate()
        }
      }
      return access.get(query)
    })
    .then(accesses => {
      const result =
        accesses.length % 2 === 0
          ? { entry: true, exit: false }
          : { entry: false, exit: true }
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @export
 * @param {*} payload
 * @returns
 */
export function createAccess(payload) {
  const uuid = uuidv4()
  // Client's ip
  const ip = requestIp.getClientIp(payload)
  // Geolocation
  const location = geoip.lookup(ip)
  return partner
    .getOne({ uuid: payload.partnerUuid })
    .then(partnerId => ({ ...payload, partner: partnerId, uuid, ip, location }))
    .then(data => access.create(data))
    .then(doc => ({ $push: { access: doc._id } }))
    .then(body =>
      partner
        .update({ uuid: payload.partnerUuid }, body)
        .populate('access')
        .populate(populate[0].populate)
    )
    .catch(error => {
      console.log(error)
    })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function updateAccess({ uuid }, { detail, payload }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return access.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleAccess(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return (
    access
      .getOne(query)
      .then(doc => !doc.active)
      .then(active => ({ active, $push: { detail } }))
      // Toggle the access active property
      .then(data => partner.update(query, data))
      .catch(error => {
        console.log(error)
      })
  )
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function destroyAccess(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return access.delete(query)
}

export const model = Access
