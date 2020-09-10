import Daom from './daom'
import group from './../models/group'
import uuidv4 from 'uuid/v4'

const dao = new Daom(group)

const populate = [
  {
    path: 'partners',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 *
 * @export
 * @returns
 */
export function getAllGroups() {
  return dao
    .get()
    .sort({ _id: -1 })
    .populate(populate)
}

/**
 *
 * @export
 * @param {*} { name, ageMin, ageMax, description, color }
 * @returns {Promise}
 */
export function createGroup(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nuevo grupo agregado' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 *
 * @export
 * @param {*} req
 * @returns
 */
export function showGroup(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateGroup({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleGroup(req) {
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
export function destroyGroup(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = group
