import { isEmpty } from './../../util'

/**
 * @param  {*} Dropout
 * @params {*}
 * @return object
 * @desc   validate the incomming request
 */
export function saveValidation(Dropout) {
  return async function ({ name, description }, uuid) {
    const errors = {}
    if (!name) errors.name = 'El nombre es requerido'
    if (!description) errors.description = 'La descripción es requerida'

    const exists = await Dropout.exists({ uuid: { $ne: uuid }, name })
    if (exists) errors.name = 'Este motivo de baja ya existe'
    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
