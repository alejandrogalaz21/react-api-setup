import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} PartnerParent
 * @params {*}
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(PartnerParent) {
  return async function (values) {
    const errors = {}
    //request validations required
    if (isEmpty(values.name)) errors.name = 'Campo requerido'
    if (isEmpty(values.lastName)) errors.lastName = 'Campo requerido'
    if (isEmpty(values.civilStatus)) errors.civilStatus = 'Campo requerido'
    if (isEmpty(values.birthDate)) errors.birthDate = 'Campo requerido'
    if (isEmpty(values.phone)) errors.phone = 'Campo requerido'
    if (isEmpty(values.cellphone)) errors.cellphone = 'Campo requerido'
    if (isEmpty(values.relationship)) errors.relationship = 'Campo requerido'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
