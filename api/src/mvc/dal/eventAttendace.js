import Daom from './daom'
import Event from './../models/event'
import Partner from './../models/partner'
import { isEmpty } from './../../util'

const event = new Daom(Event)
const partner = new Daom(Partner)

const populate = [
  {
    path: 'entries.partner exits.partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 * @export
 * @param {*} uuid
 * @returns
 */
export function showAttendanceEvent({ uuid }) {
  const query = { uuid }

  // Compare partner _id to determine if has or not exited yet
  const isSamePartner = entry => exit => exit.partner._id.equals(entry.partner._id)

  return event
    .getOne(query)
    .populate(populate)
    .lean()
    .then(event => {
      // Group the entry and exit subdocument by the partner _id
      const attendance = event.entries.map(entry => {
        const hasExited = event.exits.find(isSamePartner(entry))
        return hasExited ? { ...entry, exit: hasExited.date } : entry
      })
      const result = { ...event, attendance }
      return result
    })
}

/**
 * @export
 * @param {*}
 * @returns {Promise}
 */
export async function createEntryEvent(params, request) {
  const uuid = params.uuid
  const partnerDoc = await partner.getOne({ uuid: request.partnerUuid })

  if (partnerDoc.status !== 1) throw 'Socio no activo'

  const access = { entries: { partner: partnerDoc } }
  const data = { ...request, $push: { ...access } }

  const alreadyRegistered = await event.getOne({
    uuid,
    entries: { $elemMatch: { partner: partnerDoc } }
  })

  const doc = await event.getOne({ uuid })

  if (!partnerDoc) throw 'Sin resultados'
  if (!isEmpty(alreadyRegistered)) throw 'Ya registrado'
  if (!doc.institution.equals(partnerDoc.institution)) throw 'No pertenece a la sede'

  return event.update({ uuid }, data).populate('entries.partner')
}

/**
 * @export
 * @param {*}
 * @returns {Promise}
 */
export async function createExitEvent(params, request) {
  const uuid = params.uuid
  const partnerDoc = await partner.getOne({ uuid: request.partnerUuid })

  if (partnerDoc.status !== 1) throw 'Socio no activo'

  const access = { exits: { partner: partnerDoc } }
  const data = { ...request, $push: { ...access } }

  const isValid = await event.getOne({
    uuid,
    entries: { $elemMatch: { partner: partnerDoc } },
    exits: { $not: { $elemMatch: { partner: partnerDoc } } }
  })

  const doc = await event.getOne({ uuid })

  if (!partnerDoc) throw 'Sin resultados'
  if (isEmpty(isValid)) throw 'Acceso no válido'
  if (!doc.institution.equals(partnerDoc.institution)) throw 'No pertenece a la sede'

  const result = await event.update({ uuid }, data).populate('exits.partner').lean()

  if (result && result.entries.length === result.exits.length) {
    return { ...result, complete: true }
  }

  return result
}
