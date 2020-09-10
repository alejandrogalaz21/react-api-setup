import Daom from './daom'
import Event from './../models/event'
import uuidv4 from 'uuid/v4'

const event = new Daom(Event)

const populate = [
  {
    path: 'entries.partner exits.partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 * @export
 * @returns
 */
export function getAllEvents() {
  return event.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} { name, description, date, hour, place }
 * @returns {Promise}
 */
export function createEvent(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nuevo evento agregado' }
  const data = { ...payload, uuid, detail: [detail] }
  return event.create(data)
}

/**
 * @export
 * @param {*} uuid
 * @returns
 */
export function showEvent({ uuid }) {
  const query = { uuid }
  return event.getOne(query).populate(populate)
}

/**
 * @export
 * @param {*} { uuid, payload, detail}
 * @returns
 */
export function updateEvent({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return event.update(query, data)
}

/**
 * @export
 * @param {*} uuid, detail
 * @returns
 */
export function toggleEvent({ uuid }, { detail }) {
  const query = { uuid }

  return event
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return event.update(query, data)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @export
 * @param {*} uuid
 * @returns
 */
export function destroyEvent({ uuid }) {
  const query = { uuid }
  return event.delete(query)
}

export const model = Event
