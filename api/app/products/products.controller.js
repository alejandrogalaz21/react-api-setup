import { Router } from 'express'
import { green, blue } from './../../helpers/chalk.helper'
import { ErrorHandler } from '../../helpers/error.helper'
import { knex } from '../../server/db/mysql.connection'


export function productsController(product) {
  const router = new Router()

  router.post('/', create)
  router.get('/', readMany)
  router.get('/:_id', readOne)
  router.put('/:_id', update)
  router.delete('/:_id', remove)

  async function create(req, res, next) {
    try {
      blue('products > controller > create')
      const newEntry = req.body

      //fields validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      const result = await product.create(newEntry)
      const [id] = await knex('products').insert(newEntry)
      const [result] = await knex('products').where('id', '=', id)
      green(result)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async function readMany(req, res, next) {
    try {
      blue('products > controller > readMany')
      let query = req.query || {}
      const result = await product.find(query).sort({ updatedAt: -1 })
      const result = await knex('products').select('*')
      green(result)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async function readOne(req, res, next) {
    try {
      blue('products > controller > readOne')
      const { _id } = req.params
      const [result] = await knex('products').where('id', '=', _id)
      green(result)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async function update(req, res, next) {
    try {
      blue('products > controller > update')

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
      await knex('products').where('id', '=', _id).update(changedEntry)
      const [result] = await knex('products').where('id', '=', _id)
      green(result)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async function remove(req, res, next) {
    try {
      blue('products > controller > remove')

      //fields validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({ status: 400, message: 'validation message' })
      }

      const { _id } = req.params
      const confirmation = await knex('products').where('id', '=', _id).del()
      const result = { id: _id, removed: new Boolean(confirmation) }
      green(result)
      return res.json(result)
    } catch (error) {
      next(error)
    }
  }

  return router
}

export const products = new Router().use('/products', productsController())
