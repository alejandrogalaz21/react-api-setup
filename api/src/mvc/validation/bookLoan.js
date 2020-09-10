import { isEmpty } from './../../util'
import { createBookLoan, updateBookLoan } from '../dal/bookLoan'

/**
 * @export
 * @param {*} BookLoan
 * @params {*} isbn, partnerUuid, loanDate
 * @return object
 * @desc validate the in comming request
 */
export function saveValidation(BookLoan) {
  return async function ({ isbn, partnerUuid, loanDate }, uuid) {
    const errors = {}
    //request validations required
    if (createBookLoan === true) {
      if (!isbn) errors.isbn = 'El isbn es requerido'
      if (isEmpty(partnerUuid)) errors.partnerUuid = 'El socio es requerido'
      if (!loanDate) errors.loanDate = 'La fecha de prestamo es requerida'
    }
    if (updateBookLoan === true) {
      if (!loanDate) errors.loanDate = 'La fecha de prestamo es requerida'
    }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}

export function validationCreate(BookLoan) {
  return async function (book, quantity, isbn, partnerId) {
    let validation = { isValid: true }

    const query = { isbn, returnDate: null }
    const loans = await BookLoan.count(query)
    const partnerHasTheBook = await BookLoan.exists({ ...query, partner: partnerId })

    if (isEmpty(book) || book.active === false) {
      validation = { isValid: false, message: 'Libro no disponible' }
    } else if (partnerHasTheBook) {
      // The partner already has the book
      validation = { isValid: false, message: 'El socio ya tiene este libro prestado' }
    } else if (loans >= quantity) {
      // No more copies to loan
      validation = { isValid: false, message: 'No hay copias disponibles para prestar' }
    }

    return validation
  }
}
