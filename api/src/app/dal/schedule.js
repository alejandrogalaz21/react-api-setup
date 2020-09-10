import Daom from './daom'
import schedule from './../models/schedule'
import uuidv4 from 'uuid/v4'
import AssignmentTutor from './../models/assignmentTutor'

const dao = new Daom(schedule)
const assignmentTutor = new Daom(AssignmentTutor)

const populate = [
  {
    path: 'assignmentTutor',
    populate: [
      { path: 'user', select: 'name lastName fullName' },
      { path: 'program', populate: [{ path: 'areas' }] }
    ]
  }
]

/**
 *
 * @export
 * @returns
 */
export function getAllSchedule() {
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
export function showSchedule(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query).populate(populate)
}

/**
 *
 * @export
 * @param {*} { name, assignmentTutor }
 * @returns {Promise}
 */
export function createSchedule(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nuevo horario agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data).then(doc => {
    return AssignmentTutor.updateMany(
      { _id: { $in: payload.assignmentTutor } },
      { scheduleId: doc._id }
    ).then(() => doc)
  })
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */

export function updateSchedule({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao
    .getOne(query)
    .then(item => {
      return AssignmentTutor.updateMany(
        { _id: { $in: item.assignmentTutor } },
        { scheduleId: null }
      )
    })
    .then(() => {
      return dao
        .update(query, data)
        .populate(populate)
        .then(doc => {
          return AssignmentTutor.updateMany(
            { _id: { $in: payload.assignmentTutor } },
            { scheduleId: doc._id }
          ).then(() => doc)
        })
    })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleSchedule(req) {
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
export function destroySchedule(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = schedule
