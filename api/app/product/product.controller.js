import Product from './product'
import { Router } from 'express'
import { red, green, blue } from './../../helpers/chalk.helper'
const router = new Router()

export function productController(Collection) {
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
  async function create(req, res) {
    try {
      blue('products > controller > create')
      const newEntry = req.body

      //fields validations
      if (false) {
        return res.status(400).send({ message: 'validation message' })
      }

      // model validations
      if (false) {
        return res.status(400).send({ message: 'validation message' })
      }

      const result = await Collection.create(newEntry)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      return res.status(500).send(error)
    }
  }

  // =========
  // Read many
  // =========
  async function readMany(req, res) {
    try {
      blue('products > controller > readMany')
      let query = res.locals.query || {}
      const result = await Collection.find(query)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      return res.status(500).send(error)
    }
  }

  // ========
  // Read one
  // ========

  async function readOne(req, res) {
    try {
      blue('products > controller > readOne')
      const { _id } = req.params
      const result = await Collection.findById(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      return res.status(500).send(error)
    }
  }

  // ======
  // Update
  // ======
  async function update(req, res) {
    try {
      blue('products > controller > update')
      //fields validations
      if (false) {
        res.status(400).send({ message: 'validation message' })
        return
      }

      // model validations
      if (false) {
        res.status(400).send({ message: 'validation message' })
        return
      }

      const changedEntry = req.body
      const { _id } = req.params
      const result = await Collection.update({ _id }, { $set: changedEntry })
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      return res.status(500).send(error)
    }
  }

  // ======
  // Remove
  // ======
  async function remove(req, res) {
    try {
      blue('products > controller > remove')
      //fields validations
      if (false) {
        res.status(400).send({ message: 'validation message' })
        return
      }

      // model validations
      if (false) {
        res.status(400).send({ message: 'validation message' })
        return
      }

      const { _id } = req.params
      const result = await Collection.remove(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      red(error)
      return res.status(500).send(error)
    }
  }

  return router
}

export const product = new Router().use('/product', productController(Product))
