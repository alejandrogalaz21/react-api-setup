import User from './user'
import { Router } from 'express'
import { red, green, blue } from './../../helpers/chalk.helper'
import { ErrorHandler } from '../../helpers/error.helper'
const router = new Router()

export function usersController(Collection) {
  // ======
  // Routes
  // ======
  router.post('/', create)
  router.get('/', readMany)
  router.get('/:_id', readOne)
  router.put('/:_id', update)
  router.delete('/:_id', remove)

  // ======
  // Create
  // ======
  async function create(req, res, next) {
    try {
      blue('users > controller > create')
      const { email } = req.body
      const newEntry = req.body

      //fields validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      // model validations
      if (await Collection.exists({ email })) {
        throw new ErrorHandler({
          status: 400,
          message: 'El email no esta disponible',
          fields: { email }
        })
      }

      const result = await Collection.create(newEntry)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      next(error)
    }
  }

  // =========
  // Read many
  // =========
  async function readMany(req, res, next) {
    try {
      blue('users > controller > readMany')
      let query = req.query || {}
      const result = await Collection.find(query)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      next(error)
    }
  }

  // ========
  // Read one
  // ========

  async function readOne(req, res, next) {
    try {
      blue('users > controller > readOne')
      const { _id } = req.params
      const result = await Collection.findById(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      next(error)
    }
  }

  // ======
  // Update
  // ======
  async function update(req, res, next) {
    try {
      blue('users > controller > update')

      //fields validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      const changedEntry = req.body
      const { _id } = req.params
      const result = await Collection.update({ _id }, { $set: changedEntry })
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      next(error)
    }
  }

  // ======
  // Remove
  // ======
  async function remove(req, res, next) {
    try {
      blue('users > controller > remove')

      //fields validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      const { _id } = req.params
      const result = await Collection.remove(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      next(error)
    }
  }

  return router
}

export const users = new Router().use('/users', usersController(User))
