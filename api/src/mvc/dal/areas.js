import Daom from './daom'
import areas from './../models/areas'
import uuidv4 from 'uuid/v4'

const dao = new Daom(areas)

/**
 *
 * @export
 * @returns
 */
export function getAllAreas() {
  return dao.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showAreas(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao
    .getOne(query)
    .select('-detail')
    .lean()
}

/**
 *
 * @export
 * @param {*} { name, description }
 * @returns {Promise}
 */
export function createAreas(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nueva área agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateAreas({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleAreas(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }
      // Toggle the parent active property
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
export function destroyAreas(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = areas
