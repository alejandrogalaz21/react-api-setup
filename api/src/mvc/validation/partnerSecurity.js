import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} PartnerSecurity
 * @params {*}
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(PartnerSecurity) {
  return async function (values) {
    const errors = {}
    //request validations required
    if (isEmpty(values.question1)) errors.question1 = 'Campo requerido'
    if (isEmpty(values.question2)) errors.question2 = 'Campo requerido'
    // if (isEmpty(values.question3)) errors.question3 = 'Campo requerido'
    if (isEmpty(values.question4)) errors.question4 = 'Campo requerido'
    if (isEmpty(values.question5)) errors.question5 = 'Campo requerido'
    if (isEmpty(values.question6)) errors.question6 = 'Campo requerido'
    if (isEmpty(values.question7)) errors.question7 = 'Campo requerido'
    if (isEmpty(values.question8)) errors.question8 = 'Campo requerido'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
