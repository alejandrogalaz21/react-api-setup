import Item from './item'
import { Router } from 'express'
import { green, blue } from './../../helpers/chalk.helper'
import { ErrorHandler } from '../../helpers/error.helper'


export function itemsController(item) {
  const router = new Router()

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
      blue('items > controller > create')
      const newEntry = req.body

      //fields validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      const result = await item.create(newEntry)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  // =========
  // Read many
  // =========
  async function readMany(req, res, next) {
    try {
      blue('items > controller > readMany')
      let query = req.query || {}
      const result = await item.find(query).sort({updatedAt: -1})
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  // ========
  // Read one
  // ========

  async function readOne(req, res, next) {
    try {
      blue('items > controller > readOne')
      const { _id } = req.params
      const result = await item.findById(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  // ======
  // Update
  // ======
  async function update(req, res, next) {
    try {
      blue('items > controller > update')
      
      //fields validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      const changedEntry = req.body
      const { _id } = req.params
      const result = await item.update({ _id }, { $set: changedEntry })
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  // ======
  // Remove
  // ======
  async function remove(req, res, next) {
    try {
      blue('items > controller > remove')
     
     //fields validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      const { _id } = req.params
      const result = await item.remove(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  return router
}

export const items = new Router().use('/items', itemsController(Item))
