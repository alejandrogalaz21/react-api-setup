import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} School
 * @params {*} name, address, phone, grade, comments, uuid
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(School) {
  return async function ({ name, address, phone, grade, comments }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (isEmpty(address)) errors.address = 'La direccion es requerida'
    if (!phone) errors.phone = 'El telefono es requerida'
    if (!grade) errors.grade = 'El grado es requerida'
    if (!comments) errors.comments = 'El comentario es requerida'

    // D.B. VALIDATIONS
    if (await School.exists({ uuid: { $ne: uuid }, name }))
      errors.name = 'Este nombre de escuela ya existe'

    if (
      await School.exists({
        uuid: { $ne: uuid },
        name,
        'address.address': address.address,
        grade
      })
    )
      errors.name = 'Esta escuela ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
