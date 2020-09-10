import Daom from './daom'
import collaborator from './../models/collaborator'
import uuidv4 from 'uuid/v4'

const dao = new Daom(collaborator)

const populate = [{ path: 'position' }, { path: 'thumbnail' }]

/**
 *
 * @export
 * @returns
 */
export function getAllCollaborator() {
  return dao
    .get()
    .sort({ _id: -1 })
    .select('-fullName')
    .populate('position', 'name')
    .populate('thumbnail', 'path')
    .lean()
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showCollaborator(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao
    .getOne(query)
    .select('-detail -fullName')
    .populate('position', 'name')
    .populate('thumbnail', 'path')
    .lean()
}

/**
 * @export
 * @param {*} { name, position }
 * @returns {Promise}
 */
export function createCollaborator(payload) {
  const uuid = uuidv4()
  const detail = {
    cause: 'Creación',
    description: 'Nuevo colaborador agregado'
  }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateCollaborator({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleCollaborator(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return dao.update(query, data).populate(populate)
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
export function destroyCollaborator(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = collaborator
