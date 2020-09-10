import Daom from './daom'
import bcrypt from 'bcryptjs'
import user from './../models/user'
import { isEmpty } from './../../util/index'

const dao = new Daom(user)

/**
 *
 * @export
 * @returns
 */
export function getAllUser() {
  return dao
    .get()
    .sort({ _id: -1 })
    .populate('institutions')
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showUser(params) {
  const uuid = params.uuid
  const query = { uuid }
  return dao.getOne(query).populate('institutions')
}

/**
 *
 * @export
 * @param {*} { name, address, phone, grade, comments}
 * @returns {Promise}
 */
export async function createUser(payload) {
  try {
    console.log({ payload })
    // Generate the salt and hash
    const salt = bcrypt.genSaltSync(10)
    const decrypted = !isEmpty(payload.password)
      ? payload.passowrd
      : 'cnynl.2019'
    console.log({ decrypted })
    const password = bcrypt.hashSync(decrypted, salt)
    const detail = { cause: 'Creación', description: 'Nuevo usuario agregado' }
    const data = { ...payload, password, detail: [detail] }

    return dao.create(data)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateUser({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate('institution')
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleUser(params, body) {
  const uuid = params.uuid
  const query = { uuid }
  const { detail } = body

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return dao.update(query, data).populate('institution')
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
export function destroyUser(req) {
  const uuid = req.params.uuid
  const query = { uuid }
  return dao.delete(query)
}

export const model = user
