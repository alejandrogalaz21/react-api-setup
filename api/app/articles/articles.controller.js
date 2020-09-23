import Article from './article'
import { Router } from 'express'
import { green, blue } from './../../helpers/chalk.helper'
import { ErrorHandler } from '../../helpers/error.helper'


export function articlesController(article) {
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
      blue('articles > controller > create')
      const newEntry = req.body

      //fields validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      const result = await article.create(newEntry)
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
      blue('articles > controller > readMany')
      let query = req.query || {}
      const result = await article.find(query).sort({updatedAt: -1})
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
      blue('articles > controller > readOne')
      const { _id } = req.params
      const result = await article.findById(_id)
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
      blue('articles > controller > update')
      
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
      const result = await article.update({ _id }, { $set: changedEntry })
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
      blue('articles > controller > remove')
     
     //fields validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      // model validations
      if (false) {
        throw new ErrorHandler({status: 400, message: 'validation message' })
      }

      const { _id } = req.params
      const result = await article.remove(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  return router
}

export const articles = new Router().use('/articles', articlesController(Article))
