import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Activity
 * @params {*} name, description, program, uuid
 * @return object
 * @desc validate the in comming request
 */
export function activitySaveValidation(Activity) {
  return async function({ name, description, program }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    if (isEmpty(program)) errors.program = 'El programa es requerida'
    // D.B. VALIDATIONS
    if (
      await Activity.exists({
        uuid: { $ne: uuid },
        name
      })
    )
      errors.name = 'Este nombre de actividad ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
