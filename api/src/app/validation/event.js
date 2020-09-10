import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Event
 * @params {*} name, description, date, hour, place, category, uuid
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Event) {
  return async function ({ name, description, date, hour, place, category }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    if (!date) errors.date = 'La fecha es requerida'
    if (!hour) errors.hour = 'La hora es requerida'
    if (isEmpty(place)) errors.place = 'La direccion es requerida'
    if (!category) errors.category = 'La hora es requerida'
    // D.B. VALIDATIONS
    if (
      await Event.exists({
        uuid: { $ne: uuid },
        name
      })
    )
      errors.name = 'Este nombre de evento ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
