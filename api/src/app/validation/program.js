import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Program
 * @params {*} name, description, areas, uuid
 * @return object
 * @desc validate the in comming request
 */
export function programSaveValidation(Program) {
  return async function({ name, description, areas }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    if (isEmpty(areas)) errors.areas = 'El area es requerida'
    // D.B. VALIDATIONS
    if (
      await Program.exists({
        uuid: { $ne: uuid },
        name
      })
    )
      errors.name = 'Este nombre de programa ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
