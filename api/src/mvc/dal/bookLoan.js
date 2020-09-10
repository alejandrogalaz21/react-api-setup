import Daom from './daom'
import Book from './../models/book'
import BookLoan from './../models/bookLoan'
import Partner from './../models/partner'

const book = new Daom(Book)
const bookLoan = new Daom(BookLoan)
const partner = new Daom(Partner)

const populate = [
  {
    path: 'book',
    populate: [
      { path: 'bookLocation' },
      { path: 'thumbnail', select: 'path' },
      { path: 'category' }
    ]
  },
  {
    path: 'partner',
    populate: [{ path: 'thumbnail', select: 'path' }, { path: 'group' }]
  }
]

/**
 * @export
 * @returns
 */
export function getAllBookLoan() {
  return bookLoan
    .get()
    .populate(populate)
    .sort({ loanDate: -1 })
}

/**
 * @export
 * @returns
 */
export function getAllPartnerBookLoan(params) {
  const { uuid } = params
  return partner.getOne({ uuid }).then(doc => {
    return bookLoan.get({ partner: doc._id }).populate(populate)
  })
}

/**
 * @export
 * @param {*} uuid
 * @returns
 */
export function showBookLoan({ uuid }) {
  const query = { uuid }
  return bookLoan.getOne(query).populate(populate)
}

/**
 * @export
 * @param {*}
 * @returns {Promise}
 */
export function createBookLoan(request) {
  const isbn = request.isbn
  const partnerUuid = request.partnerUuid
  return partner
    .getOne({ uuid: partnerUuid })
    .then(partnerId => {
      return book.getOne({ isbn }).then(bookId => {
        const data = { ...request, partner: partnerId, book: bookId }
        return bookLoan.create(data).then(response => {
          return bookLoan.getOne(response).populate(populate)
        })
      })
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @export
 * @param {*} { uuid, payload, detail}
 * @returns
 */
export function updateBookLoan({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { returnDate: payload.returnDate, $push: { detail } }
  return bookLoan.update(query, data).populate(populate)
}

export const model = bookLoan
