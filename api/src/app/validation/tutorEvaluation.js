import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} TutorEvaluation
 * @return object
 * @desc   validate the in comming request
 */
export function tutorEvaluationSaveValidation(TutorEvaluation) {
  return async function ({ year, position, institution, _id }, uuid) {
    try {
      const errors = {}
      if (isEmpty(uuid)) {
        if (!year) errors.year = 'Año requerido'
        if (!position) errors.position = 'Puesto requerido'

        const exists = await TutorEvaluation.exists({ position, year, institution })
        if (exists && !_id) errors.position = 'Ya existe una evaluación del año ' + year
      } else {
        const unmodified = await TutorEvaluation.findOne({ uuid })

        if (!isEmpty(unmodified) && !isEmpty(year) && !isEmpty(position)) {
          if (year !== unmodified.year) errors.year = 'No puede modificar el año'
          if (position._id !== unmodified.position.toString())
            errors.position = 'No puede modificar la posición'
        }
      }
      const isValid = isEmpty(errors)
      return { isValid, errors }
    } catch (error) {
      console.log(error)
    }
  }
}
