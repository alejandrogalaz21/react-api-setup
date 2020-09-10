import Daom from './daom'
import activity from './../models/activity'
import uuidv4 from 'uuid/v4'

const dao = new Daom(activity)

const populate = {
  path: 'program'
}

/**
 *
 * @export
 * @returns
 */
export function getAllActivity() {
  return dao
    .get()
    .sort({ _id: -1 })
    .select(
      'name description uuid _id detail createAt updateAt active created_by updated_by'
    )
    .populate('program', 'name')
    .lean()
}

/**
 *
 * @export
 * @returns
 */
export function showActivity(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao
    .getOne(query)
    .select('-detail')
    .populate('program', 'name')
    .lean()
}

/**
 *
 * @export
 * @param {*} { name, description, program }
 * @returns {Promise}
 */
export function createActivity(payload) {
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
export function updateActivity({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleActivity(req) {
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
export function destroyActivity(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = activity
