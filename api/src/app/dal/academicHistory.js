import Daom from './daom'
import AcademicHistory from '../models/academicHistory'
import Partner from '../models/partner'

const partner = new Daom(Partner)
const academicHistory = new Daom(AcademicHistory)
const populate = [
  { path: 'school' },
  {
    path: 'partner',
    populate: [
      { path: 'school group' },
      {
        path: 'thumbnail',
        select: 'path'
      }
    ]
  }
]

/**
 * @export
 * @returns
 */
export function getAllAcademicHistory() {
  return academicHistory
    .get()
    .sort({ _id: -1 })
    .populate(populate)
}

/**
 * @export
 * @returns
 */
export function getByPartner({ uuid }) {
  return partner.getOne({ uuid }).then(doc => {
    return academicHistory.get({ partner: doc._id }).populate(populate)
  })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showAcademicHistory({ uuid }) {
  return academicHistory.getOne({ uuid }).populate(populate)
}

/**
 *
 * @export
 * @param {*}
 * @returns {Promise}
 */
export function createAcademicHistory(payload) {
  const detail = { cause: 'Creación', description: 'Nuevo registro agregado' }
  const data = { ...payload, detail: [detail] }
  return academicHistory
    .create(data)
    .then(doc => academicHistory.getOne({ _id: doc._id }).populate(populate))
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateAcademicHistory({ uuid }, { payload, detail }) {
  const data = { ...payload, $push: { detail } }
  return academicHistory.update({ uuid }, data).populate(populate)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleAcademicHistory({ uuid }, { detail }) {
  return academicHistory.getOne({ uuid }).then(doc => {
    const active = !doc.active
    const data = { active, $push: { detail } }

    return academicHistory.update({ uuid }, data).populate(populate)
  })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function destroyAcademicHistory({ uuid }) {
  return academicHistory.delete({ uuid })
}

export const model = AcademicHistory
