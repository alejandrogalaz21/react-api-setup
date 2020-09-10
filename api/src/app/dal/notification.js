import Daom from './daom'
import Notification from './../models/notification'

const dao = new Daom(Notification)

/**
 * @params none
 * @desc   retrieve all collection's documents
 */
export function getAllNotifications() {
  return dao.get().sort({ _id: -1 })
}

/**
 * @params req
 * @desc   insert a new document into the collection
 */
export function showNotification(params) {
  const uuid = params.uuid
  const query = { uuid }
  return dao.getOne(query)
}

/**
 * @params payload
 * @desc   insert a new document into the collection
 */
export function createNotification(payload) {
  const detail = { cause: 'Creación', description: 'Nueva notificación agregada' }
  const data = { ...payload, detail: [detail] }
  return dao.create(data)
}

/**
 * @params params, {payload, detail}
 * @desc   update a document and insert the justification of the change
 */
export function updateNotification(params, { payload, detail }) {
  const uuid = params.uuid
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @params payload
 * @desc   toggle the 'active' property of a document
 */
export function toggleNotification(params) {
  const uuid = params.uuid
  const query = { uuid }

  return dao
    .getOne(query)
    .then(doc => {
      const data = { active: !doc.active }
      return dao.update(query, data)
    })
    .catch(error => console.log(error))
}

/**
 * @params payload
 * @desc   delete a document
 */
export function destroyNotification(params) {
  const uuid = params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = Notification
