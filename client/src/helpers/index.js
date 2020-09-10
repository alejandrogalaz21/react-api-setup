//* ( C )( R )( U )( D )

/**
 * @param
 * @return
 * @description Add a new item to the Array
 */
export const addItem = (list, item) => [...list, item]

/**
 * @param
 * @return
 * @description Find item by id from a Array
 */
export const findItem = list => equal => list.find(equal)

/**
 * @param
 * @return
 * @description Update item from a Array
 */
// export const updatedItem = (list, item) => equalFun => {
export const updatedItem = param => (list, item) => {
  //   const index = list.findIndex(equalFun)
  const index = list.findIndex(i => i[param] === item[param])
  return [...list.slice(0, index), item, ...list.slice(index + 1)]
}

/**
 * @param
 * @return
 * @description
 * //* const equal =  equalByProp('_id')(true )
 * //* [{_id:1, name: 'lola'},{_id:2, name: 'anna'}].find(equal)
 */
export const equalByProp = prop => equal => o => o[prop] === equal

/**
 * @param
 * @return
 * @description Delete a item from a Array
 */
export const deleteItem = list => equalFun => list.filter(equalFun)

/**
 * @param
 * @return
 * @description Generates a random number
 */
export const generateId = () => Math.floor(Math.random() * 1000)

export const isEmpty = value =>
  value === null ||
  value === undefined ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'object' && Object.keys(value).length === 0)

export const isEmptyObject = o =>
  Object.keys(o).reduce(
    (res, k) => res && !(!!o[k] || o[k] === false || !isNaN(parseInt(o[k]))),
    true
  )

export const isTruthy = value => value === true || value === 'true'
export const isFalsy = value => !value || value === 'false'
