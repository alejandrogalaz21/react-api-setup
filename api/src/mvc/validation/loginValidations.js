import bcrypt from 'bcryptjs'
import { isEmpty } from './../../util/index'

/**
 * @export
 * @param {*} { email, password }
 * @description check the required fields
 * @returns Object
 */
export function validateLoginFields({ email, password }) {
  const errors = {}
  if (!email) errors.email = 'Email Es requerido.'
  if (!password) errors.password = 'Password es Requerido'
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
  return async function({ email, password }) {
    const errors = {}
    const user = await User.findOne({ email }).lean()

    if (!user) {
      errors.email = 'Credenciales Inválidas.'
      errors.passowrd = 'Credenciales Inválidas'
    } else if (user) {
      const correctCredentials = bcrypt.compareSync(password, user.password)
      if (!correctCredentials) {
        errors.email = 'Credenciales Inválidas'
        errors.passowrd = 'Credenciales Inválidas.'
      }
    }

    const isValid = isEmpty(errors)
    const result = { isValid, errors, props: user }
    return result
  }
}
