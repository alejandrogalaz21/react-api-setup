/*****************************************************************************
 *                                    DAL                                    *
 *        IN THIS FILE, WE PUT ALL THE BUSINESS LOGIC. IN THIS FILE,         *
 *   WE CREATE ALL THE FUNCTION LIKE CREATE A MODEL, GET A LIST OF MODEL,    *
 * GET A SINGLE MODEL ACCORDING TO NAME, UPDATE THE MODEL, DELETE THE MODEL. *
 *****************************************************************************/

import Daom from './daom'
import Test from './../models/test'

const dao = new Daom(Test)

/**
 *
 * @export
 * @returns
 */
export function getAllTest() {
  return dao.get().select('-__v  -detail')
}

/**
 *
 * @export
 * @param {*} req
 * @returns
 */
export function createTest(req) {
  const name = req.body.name
  const data = { name }
  return dao.create(data)
}

export function showTest(req) {
  const _id = req.params.id
  const query = { _id }
  return dao
    .getOne(query)
    .select('-__v  -detail -_id -createdAt -updatedAt -active')
}
