import Daom from './daom'
import Dropout from '../models/dropout'

const dropout = new Daom(Dropout)

/**
 * @export
 * @returns
 */
export function getAllDropout() {
  return dropout.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showDropout({ uuid }) {
  return dropout.getOne({ uuid })
}

/**
 *
 * @export
 * @param {*}
 * @returns {Promise}
 */
export function createDropout(payload) {
  const detail = { cause: 'Creación', description: 'Nuevo motivo de baja agregado' }
  const data = { ...payload, detail: [detail] }
  return dropout.create(data).then(doc => dropout.getOne({ _id: doc._id }))
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateDropout({ uuid }, { payload, detail }) {
  const data = { ...payload, $push: { detail } }
  return dropout.update({ uuid }, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleDropout({ uuid }, { detail }) {
  return dropout.getOne({ uuid }).then(doc => {
    const active = !doc.active
    const data = { active, $push: { detail } }

    return dropout.update({ uuid }, data)
  })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function destroyDropout({ uuid }) {
  return dropout.delete({ uuid })
}

export const model = Dropout
