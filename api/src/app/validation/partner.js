import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Partner
 * @params {*} {values}
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Partner) {
  return async function (values) {
    const errors = {}
    if (isEmpty(values.address)) errors.address = 'La dirección del socio es requerida'
    if (!values.birthDate) errors.birthDate = 'La fecha de cumpleaños es requerida'
    if (!values.name) errors.name = 'El nombre es requerido'
    if (!values.lastName) errors.lastName = 'El apellido es requerido'
    // if (!values.category) errors.category = 'La categoría es requerida'
    if (!values.genre) errors.genre = 'El género es requerido'
    if (isEmpty(values.school)) errors.school = 'La escuela es requerida'

    if (!isEmpty(values.category) && values.category !== 'Visitante') {
      if (isEmpty(values.attendance)) errors.attendance = 'Campo requerido'
      if (isEmpty(values.shift)) errors.shift = 'Campo requerido'
      if (isEmpty(values.group)) errors.group = 'Campo requerido'
      if (isEmpty(values.startDate)) errors.startDate = 'Campo requerido'
    }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
