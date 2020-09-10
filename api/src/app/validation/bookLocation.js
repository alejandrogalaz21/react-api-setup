import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} BookLocation
 * @params {*} classroom, location, uuid
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(BookLocation) {
  return async function ({ location, institution }, uuid) {
    const errors = {}
    //request validations required
    if (!location) errors.location = 'La ubicacion es requerida'
    if (!institution) errors.institution = 'La sede es requerida'
    // D.B. VALIDATIONS
    const exists = await BookLocation.exists({ uuid: { $ne: uuid }, location, institution })
    if (exists) errors.location = 'Este ubicación de libro ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
