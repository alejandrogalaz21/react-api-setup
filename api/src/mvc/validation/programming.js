import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Programming
 * @params {*} cycle, groups, schedule, uuid
 * @return object
 * @desc validate the in comming request
 */
export function programmingSaveValidation(Programming) {
  return async function ({ cycle, group, schedule, institution }, uuid) {
    const errors = {}
    //request validations required
    if (isEmpty(cycle)) errors.cycle = 'El ciclo es requerido'
    if (isEmpty(group)) errors.group = 'El grupo es requerido'
    if (isEmpty(schedule)) errors.schedule = 'El horario es requerido'
    if (isEmpty(institution)) errors.institution = 'La sede es requerida'

    const exists = await Programming.exists({ uuid: { $ne: uuid }, cycle, group, schedule, institution })
    const hasGroup =  await Programming.exists({ uuid: { $ne: uuid }, group, cycle, institution  })
    
    if (exists) errors.schedule = 'Registro ya existe'
    if (hasGroup) errors.group = 'Este grupo ya esta asignado un horario en este ciclo'

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
