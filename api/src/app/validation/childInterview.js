import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} ChildInterview
 * @params {*} user, date, evaluation, uuid
 * @return object
 * @desc validate the in comming request
 */
export function childInterviewSaveValidation(ChildInterview) {
  return async function({ user, date }, uuid) {
    const errors = {}
    //request validations required
    // if (isEmpty(user)) errors.user = 'El orientador es requerido'
    // if (!date) errors.date = 'La fecha es requerida'
    // D.B. VALIDATIONS
    // if (
    //   await ChildInterview.exists({
    //     uuid: { $ne: uuid },
    //     name
    //   })
    // )
    //   errors.name = 'Este nombre de  ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
