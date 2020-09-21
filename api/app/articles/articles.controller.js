import Article from './article'
import { Router } from 'express'
import { green, blue } from './../../helpers/chalk.helper'
import { ErrorHandler } from '../../helpers/error.helper'

export function articlesController(Collection) {
  const router = new Router()

  router.post('/', create)
  router.get('/', readMany)
  router.get('/:_id', readOne)
  router.put('/:_id', update)
  router.delete('/:_id', remove)

  async function create(req, res, next) {
    try {
      blue('articles > controller > create')
      const newEntry = req.body
      const result = await Collection.create(newEntry)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  async function readMany(req, res, next) {
    try {
      blue('articles > controller > readMany')
      let query = req.query || {}
      const result = await Collection.find(query)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  async function readOne(req, res, next) {
    try {
      blue('articles > controller > readOne')
      const { _id } = req.params
      const result = await Collection.findById(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  async function update(req, res, next) {
    try {
      blue('articles > controller > update')
      const changedEntry = req.body
      const { _id } = req.params
      const result = await Collection.update({ _id }, { $set: changedEntry })
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  async function remove(req, res, next) {
    try {
      blue('articles > controller > remove')
      const { _id } = req.params
      const result = await Collection.remove(_id)
      green(result)
      return res.send(result)
    } catch (error) {
      next(error)
    }
  }

  return router
}

export const articles = new Router().use('/articles', articlesController(Article))
