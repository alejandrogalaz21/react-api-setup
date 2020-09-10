import Daom from './daom'
import programming from './../models/programming'
import uuidv4 from 'uuid/v4'

const dao = new Daom(programming)

export const populate = [
  { path: 'cycle' },
  { path: 'group' },
  {
    path: 'schedule',
    populate: [
      {
        path: 'assignmentTutor',
        populate: [{ path: 'program', populate: [{ path: 'areas' }] }]
      }
    ]
  }
]

/**
 *
 * @export
 * @returns
 */
export function getAllProgramming() {
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
export function showProgramming(query) {
  return dao.getOne(query).populate(populate)
}

/**
 *
 * @export
 * @param {*} { cycle, group, schedule }
 * @returns {Promise}
 */
export function createProgramming(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nueva programación agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateProgramming({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleProgramming(req) {
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
export function destroyProgramming(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = programming
