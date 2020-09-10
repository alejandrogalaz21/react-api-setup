import moment from 'moment'
import { isEmpty } from './../../util'
import Clasroom from './../models/classroom'
import User from './../models/user'

/**
 * @export
 * @param {*} AssignmentTutor
 * @params {*} program, user, schedule, startDate, endDate, uuid
 * @return object
 * @desc validate the in comming request
 */
export function assignmentTutorSaveValidation(AssignmentTutor) {
  return async function(
    { program, user, schedule, startDate, endDate, institution },
    uuid
  ) {
    const errors = {}
    //request validations required
    if (isEmpty(program)) errors.program = 'El programa es requerido'
    if (isEmpty(user)) errors.user = 'El usuario es requerido'
    if (isEmpty(startDate)) errors.startDate = 'La fecha de inicio es requerida'
    if (isEmpty(endDate)) errors.endDate = 'La fecha final es requerida'
    if (isEmpty(schedule)) errors.schedule = 'El horario es requerido'
    if (isEmpty(institution)) errors.institution = 'La sede es requerida'
    if (startDate === endDate) errors.startDate = 'Error fechas iguales'

    // D.B. VALIDATIONS
    if (moment(endDate).isSameOrBefore(startDate)) {
      errors.endDate = 'La fecha fin debe ser posterior a la inicial'
    }

    if (institution) {
      const userDoc = await User.findById(user)
      if (!userDoc.institutions.includes(institution)) {
        errors.user = 'El usuario no pertenece a la sede que seleccionó'
      }
    }

    let result = await AssignmentTutor.find({
      user,
      startDate,
      endDate,
      uuid: { $ne: uuid }
    }).select('schedule')
    {
      schedule &&
        schedule.forEach(item => {
          result.forEach(item2 => {
            item2.schedule.forEach(item3 => {
              if (item.day === item3.day) {
                const startHour = moment(item3.startHour, 'HH:mm')
                const endHour = moment(item3.endHour, 'HH:mm')
                if (
                  moment(item.startHour, 'HH:mm').isBetween(
                    startHour,
                    endHour,
                    null,
                    '[)'
                  ) ||
                  moment(item.endHour, 'HH:mm').isBetween(startHour, endHour, null, '(]')
                ) {
                  errors.user = `Tutor ocupado en este horario (Horario ${item3.day} - ${item3.startHour} - ${item3.endHour})`
                }
              }
            })
          })
        })
    }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
