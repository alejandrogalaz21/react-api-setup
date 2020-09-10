import { Router } from 'express'
import * as file from '../controllers/file'
import { authenticated } from './../middlewares'

const router = new Router()

// @access    Private
// @route     GET api/file
// @desc      get all the records.
// @params    none.
router.get('/file', file.index)

// @access    Private
// @route     GET api/file/count
// @desc      return the count of all records.
// @params    none.
router.get('/file/count', file.count)

// @access    Private
// @route     GET api/file/id
// @desc      get single record.
// @params    id.
router.get('/file/:id', file.show)

// @access    Private
// @route     POST api/file
// @desc      create a record.
// @params    Object.
router.post('/file', file.create)

// @access    Private
// @route     PUT api/file/id
// @desc      update a record.
// @params    id, Object.
router.put('/file/:id', file.update)

// @access    Private
// @route     DELETE api/file/id
// @desc      delete a record.
// @params    id, Object.
router.delete('/file/:id', file.destroy)

export default router
