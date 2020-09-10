import * as permissions from '../controllers/permissions'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 * @access    Public
 * @route     GET api/permissions
 * @desc      get all the records.
 * @params    none.
 */
router.get('/permissions', authenticated, acl, permissions.index)

/**
 * @access    Public
 * @route     GET api/permissions/count
 * @desc      get the count of total records.
 * @params    none
 */
router.get('/permissions/count', authenticated, acl, permissions.count)

/**
 * @access    Public
 * @route     GET api/permissions/id
 * @desc      get single record.
 * @params    id.
 */
router.get('/permissions/:uuid', authenticated, acl, permissions.show)

/**
 * @access    Public
 * @route     POST api/permissions
 * @desc      create a record.
 * @params    Object.
 */
router.post('/permissions', authenticated, acl, permissions.create)

// /**
//  * @access    Public
//  * @route     POST api/permissions/validate
//  * @desc      validate a record.
//  * @params    Object.
//  */
// router.post('/permissions/validate', authenticated, acl, permissions.validate)

/**
 * @access    Public
 * @route     PUT api/permissions/id
 * @desc      update a record.
 * @params    id, Object.
 */
router.put('/permissions/:uuid', authenticated, acl, permissions.update)

/**
 * @access    Public
 * @route     PUT api/permissions/toggle/:uuid
 * @desc      toggle (active/inactive) a record
 * @params    id, Object.
 */
router.put('/permissions/toggle/:uuid', authenticated, acl, permissions.toggle)

/**
 * @access    Public
 * @route     DELETE api/permissions/:uuid
 * @desc      delete a record
 * @params    id, Object.
 */
router.delete('/permissions/:uuid', authenticated, acl, permissions.destroy)

export default router
