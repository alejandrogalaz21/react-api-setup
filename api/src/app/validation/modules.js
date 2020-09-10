import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Modules
 * @params {*} low, high, changes
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Modules) {
  return async function ({ name, url }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'Campo requerido'
    if (!isEmpty(url) && isEmpty(url.app)) errors.url.app = 'URL de APP requerida'
    if (!isEmpty(url) && isEmpty(url.api)) errors.url.api = 'URL de API requerida'

    const exists = await Modules.exists({ uuid: { $ne: uuid }, name })
    if (exists) errors.name = 'Este módulo ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
