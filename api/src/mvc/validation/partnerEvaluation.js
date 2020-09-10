import { isEmpty } from './../../util'

/**
 * @param   PartnerEvaluation,
 * @return  object
 * @desc    validate the in comming request
 */
export function saveValidation(PartnerEvaluation) {
  return async function ({ year, position }, uuid) {
    try {
      const errors = {}
      // Implement validations when module logical relations are concluded
      const isValid = isEmpty(errors)
      return { isValid, errors }
    } catch (error) {
      console.log(error)
    }
  }
}
