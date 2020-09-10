import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Access
 * @params {*} partner, date, entry, exit
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Access) {
  return async function ({ partnerUuid, date, entry, exit }) {
    const errors = {}
    //request validations required
    if (isEmpty(partnerUuid)) errors.partnerUuid = 'El socio es requerido'
    if (!date) errors.date = 'La fecha es requerida'
    if (!(entry === true || entry === false)) errors.entry = 'La entrada es requerida'
    if (!(exit === true || exit === false)) errors.exit = 'La salida es requerida'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
