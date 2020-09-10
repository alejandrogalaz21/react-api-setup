import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Fee
 * @params {*} partner, concept, discount, date, amount, description
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Fee) {
  return async function ({ partner, concept, discount, date, amount, description }) {
    const errors = {}
    //request validations required
    if (isEmpty(partner)) errors.partner = 'El socio es requerido'
    if (!concept) errors.concept = 'El concepto es requerido'
    if (!discount) errors.discount = 'El descuento es requerido'
    if (!date) errors.date = 'La fecha es requerida'
    if (!amount) errors.amount = 'La cantidad a pagar es requerido'
    if (!description) errors.description = 'La descripcion es requerida'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
