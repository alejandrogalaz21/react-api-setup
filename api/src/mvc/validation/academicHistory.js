import { isEmpty } from './../../util'

/**
 * @param  {*} AcademicHistory
 * @params {*}
 * @return object
 * @desc   validate the incomming request
 */
export function academicHistoryValidation(AcademicHistory) {
  return async function() {
    const errors = {}
    // if (!partner) errors.partner = 'El socio es requerido'
    // if (!school) errors.date = 'La fecha es requerida'
    // if (!(entry === true || entry === false)) errors.entry = 'La entrada es requerida'
    // if (!(exit === true || exit === false)) errors.exit = 'La salida es requerida'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
