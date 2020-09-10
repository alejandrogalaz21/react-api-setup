import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Areas
 * @params {*} name, description, color, uuid
 * @return object
 * @desc validate the in comming request
 */
export function areasSaveValidation(Areas) {
  return async function({ name, description, color }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    if (!color) errors.color = 'El color es requerida'

    if (
      await Areas.exists({
        uuid: { $ne: uuid },
        name
      })
    )
      errors.name = 'Este nombre de area ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
