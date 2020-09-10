import Daom from './daom'
import category from './../models/category'
import uuidv4 from 'uuid/v4'

const dao = new Daom(category)

/**
 *
 * @export
 * @returns
 */
export function getAllCategory() {
	return dao.get().sort({ _id: -1 })
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function showCategory(req) {
	const uuid = req.params.uuid
	const query = { uuid }
	return dao.getOne(query).select('-detail').lean()
}

/**
 *
 * @export
 * @param {*} { name }
 * @returns {Promise}
 */
export function createCategory(payload) {
	const uuid = uuidv4()
	const detail = { cause: 'Creación', description: 'Nueva categoría agregada' }
	const data = { ...payload, uuid, detail: [ detail ] }
	return dao.create(data)
}

/**
 * @export
 * @param {*} { uuid, payload, detail }
 * @returns
 */
export function updateCategory({ uuid }, { payload, detail }) {
	const query = { uuid }
	const data = { ...payload, $push: { detail } }
	return dao.update(query, data)
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function toggleCategory(req) {
	const uuid = req.params.uuid
	const query = { uuid }
	const { detail } = req.body

	return dao
		.getOne(query)
		.then((doc) => {
			const active = !doc.active
			const data = { active, $push: { detail } }

			return dao.update(query, data)
		})
		.catch((error) => {
			console.log(error)
		})
}

/**
 * @export
 * @param {*} req
 * @returns
 */
export function destroyCategory(req) {
	const uuid = req.params.uuid
	const query = { uuid }
	return dao.delete(query)
}

export const model = category
