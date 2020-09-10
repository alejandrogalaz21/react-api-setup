/**
 *
 * @param {*} name
 * @param {*} httpCode
 * @param {*} description
 * @param {*} isOperational
 */
function errorHandler(name, httpCode, description, isOperational) {
  Error.call(this)
  Error.captureStackTrace(this)
  this.name = name
  //...other properties assigned here
}

errorHandler.prototype.__proto__ = Error.prototype

/**
 *
 * @param {*} value
 * @returns {Boolean}
 * @description check if a Object
 * Array , String o variable has
 * a value.
 */
export const isEmpty = value =>
  value === null ||
  value === undefined ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === 'string' && value.trim().length === 0) ||
  (typeof value === 'object' && Object.keys(value).length === 0)

export const areNotEmpty = values => values.map(isEmpty).every(item => item === false)

/**
 *
 * @param {*} moduleName
 * @returns {Object}
 * @description Generates Routes Names.
 */
export const routesGenerator = moduleName => ({
  open: {
    route: `/${moduleName}`,
    routeId: `/${moduleName}/:id`,
    routeNameId: `/${moduleName}/where/`,
    routeCount: `/${moduleName}/count`,
    routeVisits: `/${moduleName}/visits`,
    active: `/${moduleName}/activate/:id`
  },
  close: {
    route: `/${moduleName}/private`,
    routeId: `/${moduleName}/private/:id`,
    routeNameId: `/${moduleName}/private/where/`,
    routeCount: `/${moduleName}/private/count`,
    routeVisits: `/${moduleName}/private/visits`,
    active: `/${moduleName}/private/activate/:id`
  }
})

export const waterfall = (...iterable) =>
  iterable.reduce((p, fn) => p.then(fn), Promise.resolve())

/**
 * Handle expection on function call
 * @author  Anonymous
 * @param   {function}  fn     function to be called
 * @param   {string}    value  default value if it fails
 * @returns {void} function fn return value
 */
export const getSafe = (fn, value = undefined) => {
  try {
    return fn()
  } catch (e) {
    return value
  }
}

/**
 * Generate matrix of numrows * numcols with the option of an initial value
 * @author  Anonymous
 * @param   {number}  numrows  # of rows
 * @param   {number}  numcols  # of columns
 * @returns {array} matrix
 */
export const generateMatrix = (numrows, numcols, initial) => {
  let arr = []
  for (let i = 0; i < numrows; ++i) {
    let columns = []
    for (let j = 0; j < numcols; ++j) {
      columns[j] = initial
    }
    arr[i] = columns
  }
  return arr
}

// Return the average in a array of numbers
export function average(nums) {
  if (!nums) return 0
  return nums.reduce((a, b) => a + b) / nums.length
}

export { errorHandler }
