import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Collaborator
 * @params {*} name, lastName, genre, email, phone, position, uuid
 * @return object
 * @desc validate the in comming request
 */
export function collaboratorSaveValidation(Collaborator) {
  return async function({ name, lastName, genre, email, phone, position }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerido'
    if (!lastName) errors.lastName = 'El apellido es requerido'
    if (!genre) errors.genre = 'El genero es requerido'
    if (!email) errors.email = 'El correo electronico es requerido'
    if (!phone) errors.phone = 'El telefono es requerido'
    if (!position) errors.position = 'El puesto es requerido'

    // D.B. VALIDATIONS
    if (
      await Collaborator.exists({
        uuid: { $ne: uuid },
        email
      })
    )
      errors.email = 'Este correo electronico ya existe'

    if (
      await Collaborator.exists({
        uuid: { $ne: uuid },
        phone
      })
    )
      errors.phone = 'Este telefono ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
