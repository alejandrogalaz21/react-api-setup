import Daom from './daom'
import Book from './../models/book'
import uuidv4 from 'uuid/v4'

const dao = new Daom(Book)

const populate = [
  { path: 'bookLocation', populate: [{ path: 'institution', select: 'name' }] },
  { path: 'thumbnail' },
  { path: 'category' }
]

/**
 *
 * @export
 * @returns
 */
export function getAllBook() {
  return dao
    .get()
    .populate(populate)
    .sort({ _id: -1 })
}

/**
 *
 *
 * @export
 * @param {*} { title, isbn, author, editorial, description, category }
 * @returns {Promise}
 */
export function createBook(payload) {
  const uuid = uuidv4()
  const detail = { cause: 'Creación', description: 'Nuevo libro agregado' }
  const data = { ...payload, uuid, detail: [detail] }
  return dao.create(data)
}

/**
 *
 * @export
 * @param {*} uuid
 * @returns
 */
export function showBook({ uuid }) {
  const query = { uuid }
  return dao.getOne(query).populate(populate)
}

/**
 * @export
 * @param {*} {uuid, payload, detail}
 * @returns
 */
export function updateBook({ uuid }, { payload, detail }) {
  const query = { uuid }
  const data = { ...payload, $push: { detail } }
  return dao.update(query, data).populate(populate)
}

/**
 * @export
 * @param {*} {uuid, detail}
 * @returns
 */
export function toggleBook({ uuid }, { detail }) {
  const query = { uuid }

  return dao
    .getOne(query)
    .then(doc => {
      const active = !doc.active
      const data = { active, $push: { detail } }

      return dao.update(query, data).populate(populate)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * @export
 * @param {*} uuid
 * @returns
 */
export function destroyBook({ uuid }) {
  const query = { uuid }
  return dao.delete(query)
}

export const model = Book
