import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Group
 * @params {*} name, ageMin, ageMax, description, color, uuid
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Group) {
  return async function ({ name, ageMin, ageMax, description, color }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (!ageMin) errors.ageMin = 'La edad minima es requerida'
    if (!ageMax) errors.ageMax = 'La edad maxima es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    if (!color) errors.color = 'El color es requerida'
    // D.B. VALIDATIONS
    if (await Group.exists({ uuid: { $ne: uuid }, name }))
      errors.name = 'Este nombre de grupo ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
