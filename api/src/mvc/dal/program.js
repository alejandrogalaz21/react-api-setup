import Daom from './daom'
import program from './../models/program'
import uuidv4 from 'uuid/v4'

const dao = new Daom(program)

const populate = {
  path: 'areas'
}
/**
 *
 * @export
 * @returns
 */
export function getAllProgram() {
  return dao
    .get()
    .sort({ _id: -1 })
    .populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showProgram(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query).populate(populate)
}

/**
 *
 * @export
 * @param {*} { name, description, areas }
 * @returns {Promise}
 */
export function createProgram(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nuevo programa agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateProgram({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleProgram(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }
      // Toggle the parent active property
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
export function destroyProgram(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = program
