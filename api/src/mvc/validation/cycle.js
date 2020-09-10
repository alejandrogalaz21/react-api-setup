import { isEmpty, areNotEmpty } from './../../util'
import moment from 'moment'
import { mdy } from '../../util/dates'

function generateErrorMessage({ name, startDate, endDate }) {
  return `El ciclo ${name} ya está entre (${mdy(startDate)} - ${mdy(endDate)})`
}

/**
 * @export
 * @param {*} Cycle
 * @params {*} name, startDate, endDate
 * @return object
 * @desc validate the in comming request
 */
export function cycleSaveValidation(Cycle) {
  return async function ({ name, startDate, endDate }, uuid) {
    const errors = {}

    //request validations required
    if (!name) errors.name = 'El nombre es requerido'
    if (!startDate) errors.startDate = 'La fecha de inicio es requerida'
    if (!endDate) errors.endDate = 'La fecha de finalizacion es requerida'

    // D.B. VALIDATIONS
    const exists = await Cycle.exists({ uuid: { $ne: uuid }, name })
    if (exists) errors.name = 'Este nombre de ciclo ya existe'

    const isBetween = await Cycle.findOne({
      uuid: { $ne: uuid },
      $or: [
        { endDate: { $lte: endDate, $gte: startDate } },
        { startDate: { $lte: endDate, $gte: startDate } },
        {
          startDate: { $lte: endDate },
          endDate: { $gte: endDate }
        }
      ]
    })
      .select('name startDate endDate')
      .lean()

    if (moment(endDate).isSameOrBefore(startDate)) {
      errors.endDate = 'La fecha fin debe ser posterior a la inicial'
    } else if (!isEmpty(isBetween)) {
      errors.name = generateErrorMessage(isBetween)
    }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}
