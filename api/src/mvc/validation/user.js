import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} User
 * @params {*} name, lastName, email, institutions, uuid
 * @return object
 * @desc validate the incomming request
 */
export function saveValidation(User) {
  return async function({ name, lastName, email, institutions, role }, uuid) {
    const errors = {}
    // Request validations required
    if (!name) errors.name = 'El nombre es requerido'
    if (!email) errors.email = 'El correo electrónico es requerido'
    if (!lastName) errors.lastName = 'El apellido es requerido'
    if (role != 0) {
      if (isEmpty(institutions)) errors.institutions = 'La sede es requerida'
    }
    // D.B. VALIDATIONS
    const existName = await User.exists({ uuid: { $ne: uuid }, email })
    if (existName) errors.email = 'Este correo electrónico ya está registrado'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
