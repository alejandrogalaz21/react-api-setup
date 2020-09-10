import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Classroom
 * @params {*} name, institution, uuid
 * @return object
 * @desc validate the in comming request
 */
export function classroomSaveValidation(Classroom) {
  return async function ({ name, institution }, uuid) {
    const errors = {}
    //request validations required
    if (!name) errors.name = 'El nombre es requerida'
    if (isEmpty(institution)) errors.institution = 'La sede es requerida'
    // D.B. VALIDATIONS
    const exists = await Classroom.exists({ uuid: { $ne: uuid }, name, institution })
    if (exists) errors.name = 'Esta aula ya existe'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
