import Daom from './daom'
import classroom from './../models/classroom'
import uuidv4 from 'uuid/v4'

const dao = new Daom(classroom)

const populate = {
  path: 'institution'
}

/**
 *
 * @export
 * @returns
 */
export function getAllClassroom() {
  return dao
    .get()
    .sort({ _id: -1 })
    .select('name uuid _id detail createAt updateAt active created_by updated_by')
    .populate('institution', 'name')
    .lean()
}

/**
 *
 * @export
 * @returns
 */
export function showClassroom(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao
    .getOne(query)
    .select('-detail')
    .populate('institution', 'name')
    .lean()
}

/**
 *
 * @export
 * @param {*} { name, institution }
 * @returns {Promise}
 */
export function createClassroom(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nueva actividad agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateClassroom({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleClassroom(req) {
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
export function destroyClassroom(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = classroom
