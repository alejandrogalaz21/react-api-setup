import Daom from './daom'
import cycle from './../models/cycle'
import uuidv4 from 'uuid/v4'

const dao = new Daom(cycle)

/**
 * @export
 * @returns
 */
export function getAllCycle() {
  return dao.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showCycle(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.getOne(query)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showCurrentCycle() {
  const today = new Date()
  return dao.getOne({ startDate: { $lte: today }, endDate: { $gte: today } })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function readCycle() {
  const today = new Date()
  return dao.getOne({
    startDate: { $lte: today },
    endDate: { $gte: today },
    active: true
  })
}

/**
 * @export
 * @param {*}
 * @returns {Promise}
 */
export function createCycle(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nuevo ciclo agregado' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 * @export
 * @param {*}
 * @returns
 */
export function updateCycle({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleCycle(req) {
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
export function destroyCycle(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = cycle
