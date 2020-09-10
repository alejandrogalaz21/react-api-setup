import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Institution
 * @params {*} name, description, address, uuid
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Institution) {
  return async function ({ code, name, description, address }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerido'
    if (isEmpty(address)) errors.address = 'La direccion es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    // D.B. VALIDATIONS
    if (await Institution.exists({ uuid: { $ne: uuid }, name }))
      errors.name = 'Este nombre de sede ya existe'

    const existsCode = await Institution.findOne({ uuid: { $ne: uuid }, code })
    if (!isEmpty(existsCode) && !isEmpty(code)) {
      errors.code = `Este código de sede ya existe (${existsCode.name})`
    }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
