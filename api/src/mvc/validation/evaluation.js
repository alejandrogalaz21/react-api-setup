import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Evaluation
 * @params {*} position, cycle, comment
 * @return object
 * @desc validate the in comming request
 */
export function evaluationSaveValidation(Evaluation) {
  return async function({ position, cycle, comment }) {
    const errors = {}
    //request validations required
    if (isEmpty(position)) errors.position = 'El puesto es requerido'
    if (isEmpty(cycle)) errors.cycle = 'El ciclo es requerido'
    // if (!comment) errors.comment = 'La observacion es requerida'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
