import { errorHandler } from './../../helpers/error.helper'
import { red } from './../../helpers/chalk.helper'

export function errorCentralHandler(err, req, res, next) {
  red(err)
  const error = errorHandler(err)
  return res.status(error.status).send(error)
}
