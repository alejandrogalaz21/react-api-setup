import bcrypt from 'bcryptjs'
import { isEmpty } from './../../util/'

/**
 * @export
 * @param {*} { email, password }
 * @description check the required fields
 * @returns Object
 */
export function validateLoginFields({ email, password }) {
  const errors = {}
  if (!email) errors.message = 'Email requerido'
  if (!password) errors.message = 'Contraseña requerida'

  const isValid = isEmpty(errors)
  const result = { isValid, errors }
  return result
}

/**
 * @export
 * @param {*} User
 * @param {*} { email, password }
 * @description check the request props vs db
 * @returns
 */
export function validateUser(User) {
  return async function ({ email, password }) {
    const errors = {}
    const user = await User.findOne({ email }).lean()

    if (!user) {
      errors.message = 'Credenciales inválidas'
    } else if (user) {
      const correctCredentials = bcrypt.compareSync(password, user.password)
      if (!correctCredentials) {
        errors.message = 'Credenciales inválidas'
      } else if (user.active !== true) {
        errors.message = 'Usuario inactivo'
      }
    }

    const isValid = isEmpty(errors)
    const result = { isValid, errors, props: user }
    return result
  }
}
