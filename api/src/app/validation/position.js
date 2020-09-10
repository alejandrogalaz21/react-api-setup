import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Position
 * @params {*} name, description, uuid
 * @return object
 * @desc validate the in comming request
 */
export function positionSaveValidation(Position) {
  return async function({ name, description, questionnaire }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    if (isEmpty(questionnaire) || !Array.isArray(questionnaire))
      errors.questionnaire = 'Las preguntas son requeridas'

    // D.B. VALIDATIONS
    if (
      await Position.exists({
        uuid: { $ne: uuid },
        name
      })
    )
      errors.name = 'Este nombre de puesto ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
