import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} DiagnosticEvaluation
 * @params {*} user, date, evaluation, uuid
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(DiagnosticEvaluation) {
  return async function ({ user, date, evaluation }, uuid) {
    const errors = {}
    //request validations required
    if (isEmpty(user)) errors.user = 'El orientador es requerido'
    if (!evaluation) errors.evaluation = 'La evaluacion es requerida'
    if (!date) errors.date = 'La fecha es requerida'
    // D.B. VALIDATIONS
    // if (
    //   await DiagnosticEvaluation.exists({
    //     uuid: { $ne: uuid },
    //     name
    //   })
    // )
    //   errors.name = 'Este nombre de  ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
