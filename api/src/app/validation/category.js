import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Category
 * @params {*} name, uuid
 * @return object
 * @desc validate the in comming request
 */
export function categorySaveValidation(Category) {
  return async function({ name }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    // D.B. VALIDATIONS
    if (
      await Category.exists({
        uuid: { $ne: uuid },
        name
      })
    )
      errors.name = 'Este nombre de categoria ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
