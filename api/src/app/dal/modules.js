import Daom from './daom'
import modules from './../models/modules'
import uuidv4 from 'uuid/v4'

const dao = new Daom(modules)

/**
 *
 * @export
 * @returns
 */
export function getAllModules() {
  return dao.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showModules(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query)
}

/**
 *
 * @export
 * @param {*} {  }
 * @returns {Promise}
 */
export function createModules(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nuevo modulo agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateModules({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleModules(req) {
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
export function destroyModules(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = modules
