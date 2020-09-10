import Daom from './daom'
import bookLocation from './../models/bookLocation'
import uuidv4 from 'uuid/v4'

const dao = new Daom(bookLocation)

/**
 *
 * @export
 * @returns
 */
export function getAllBookLocation() {
  return dao.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showBookLocation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query)
}

/**
 * @export
 * @param {*} { classroom, location }
 * @returns {Promise}
 */
export function createBookLocation(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nueva ubicacion agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateBookLocation({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleBookLocation(req) {
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
export function destroyBookLocation(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = bookLocation
