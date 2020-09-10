import Daom from './daom'
import AssignmentTutor from './../models/assignmentTutor'
import Cycle from './../models/cycle'

const assignmentTutor = new Daom(AssignmentTutor)
const cycle = new Daom(Cycle)

const populate = [
  { path: 'program', populate: [{ path: 'areas' }] },
  { path: 'user' },
  { path: 'classroom' }
]

/**
 * @export
 * @returns
 */
export function getAllAssignmentTutor() {
  return assignmentTutor
    .get()
    .sort({ _id: -1 })
    .populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showAssignmentTutor(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return assignmentTutor.getOne(query).populate(populate)
}

/**
 *
 * @export
 * @param {*} { program, user, schedule, startDate, endDate }
 * @returns {Promise}
 */
export function createAssignmentTutor(payload) {
  const today = new Date()
  const detail = { cause: 'Creación', description: 'Nueva asignacion agregada' }
  const data = { ...payload, uuid, detail: [detail] }
  return cycle
    .getOne({ startDate: { $lte: today }, endDate: { $gte: today } })
    .then(doc => assignmentTutor.create({ ...data, cycle: doc._id }))
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateAssignmentTutor({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return assignmentTutor.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleAssignmentTutor(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  const { detail } = req.body

  return assignmentTutor
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return assignmentTutor.update(query, data).populate(populate)
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
export function destroyAssignmentTutor(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return assignmentTutor.delete(query)
}

export const model = AssignmentTutor
