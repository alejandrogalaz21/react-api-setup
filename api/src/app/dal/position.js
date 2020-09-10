import Daom from './daom'
import position from './../models/position'

const dao = new Daom(position)

/**
 *
 * @export
 * @returns
 */
export function getAllPosition() {
  return dao.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showPosition(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao
    .getOne(query)
    .select('-detail -users')
    .lean()
}

/**
 *
 * @export
 * @param {*} { name, description }
 * @returns {Promise}
 */
export function createPosition(payload) {
  const detail = { cause: 'Creación', description: 'Nuevo puesto agregado' }
  const data = { ...payload, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updatePosition({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function togglePosition(req) {
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
export function destroyPosition(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = position
