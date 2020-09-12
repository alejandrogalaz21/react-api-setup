import mongoose from 'mongoose'

export class ErrorHandler extends Error {
  constructor({ status = 500, message = 'Internal server error', error, fields = {} }) {
    super()
    this.status = status
    this.message = message
    this.error = error
    this.fields = fields
  }
}

export function errorHandler(error) {
  if (error instanceof ErrorHandler) {
    return error
  } else if (error instanceof mongoose.Error.ValidationError) {
    const fields = Object.keys(error.errors).reduce((pre, key) => {
      pre[key] = error.errors[key].message
      return pre
    }, {})
    return new ErrorHandler({ status: 400, error: 'MongoValidationError', fields })
  }

  return new ErrorHandler({ error: String(error) })
}
