import { isEmpty } from './../../util'

/**
 * @export
 * @param {*} Book
 * @params {*} title, autor, isbn, category, description, editorial, bookLocation, institution, uuid
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(Book) {
  return async function(
    { title, author, category, description, bookLocation, copies },
    uuid
  ) {
    const errors = {}
    //request validations required
    if (!title) errors.title = 'El titulo es requerido'
    if (!author) errors.author = 'El autor es requerido'
    // if (isEmpty(isbn)) errors.isbn = 'El código ISBN es requerido';
    if (isEmpty(category)) errors.category = 'La categoria es requerida'
    if (!description) errors.description = 'La descripcion es requerida'
    // if (!editorial) errors.editorial = 'El editorial es requerida'
    if (isEmpty(bookLocation)) errors.bookLocation = 'La ubicacion es requerida'
    if (isEmpty(copies)) errors.copies = 'Campo requerido'
    // D.B. VALIDATIONS

    let result = await Book.find({
      uuid: { $ne: uuid },
      bookLocation
    }).select('copies')
    {
      copies &&
        copies.forEach(item => {
          result.forEach(item2 => {
            item2.copies.forEach(item3 => {
              if (item.isbn == item3.isbn) {
                errors.bookLocation = 'ISBN ya existente en esta sede'
              }
            })
          })
        })
    }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}

/**
 *
 * @param {*} Model
 * @returns Object
 */
function requiredAndUniqueValidation(Model) {
  return async function(key, toValidate) {
    if (toValidate[key]) return { [key]: `${[key]} es requerida` }
    if (await Model.exists({ [key]: toValidate[key] }))
      return { [key]: `${[key]} ya existe` }
    return null
  }
}

/**
 *
 * @param {*} key
 * @param {*} toValidate
 * @returns Object
 */
function isRequired(key, toValidate) {
  if (toValidate || toValidate[key]) return { [key]: `es requerido` }
  return null
}

/**
 *
 * @param {*} Model
 * @returns Object
 */
function isUnique(Model) {
  return async function(key, toValidate) {
    if (await Model.exists({ [key]: toValidate[key] })) return { [key]: `ya existe` }
    return null
  }
}
