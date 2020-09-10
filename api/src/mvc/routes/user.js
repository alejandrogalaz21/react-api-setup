import * as user from '../controllers/user'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'
import { filterMiddleware } from './../middlewares/institutionMiddleware'

const institutionMiddleware = filterMiddleware('institutions')
const router = new Router()

/**
 * @access    Private
 * @route     GET api/user
 * @desc      get all the records.
 * @params    none.
 */
router.get('/user', authenticated, acl, institutionMiddleware, user.index)

/**
 * @access    Private
 * @route     GET api/user/count
 * @desc      get the count of total records.
 * @params    none
 */
router.get('/user/count', authenticated, acl, institutionMiddleware, user.count)

/**
 * @access    Private
 * @route     GET api/user/edit/:uuid
 * @desc      get single record to edit
 * @params    none
 */
router.get('/user/edit/:uuid', authenticated, acl, institutionMiddleware, user.edit)

/**
 * @access    Private
 * @route     GET api/user/id
 * @desc      get single record.
 * @params    id.
 */
router.get('/user/:uuid', authenticated, user.show)

/**
 * @access    Private
 * @route     POST api/user
 * @desc      create a record.
 * @params    Object.
 */
router.post('/user', authenticated, acl, user.create)

/**
 * @access    Private
 * @route     POST api/user/validate
 * @desc      validate a record.
 * @params    Object.
 */
router.post('/user/validate', authenticated, user.validate)

/**
 * @access    Private
 * @route     PUT api/user/id
 * @desc      update a record.
 * @params    id, Object.
 */
router.put('/user/:uuid', authenticated, acl, user.update)

/**
 * @access    Private
 * @route     PUT api/user/toggle/:uuid
 * @desc      toggle (active/inactive) a record
 * @params    id, Object.
 */
router.put('/user/toggle/:uuid', authenticated, acl, user.toggle)

/**
 * @access    Private
 * @route     DELETE api/user/:uuid
 * @desc      delete a record
 * @params    id, Object.
 */
router.delete('/user/:uuid', authenticated, acl, user.destroy)

/**
 *@access    Private
 *@route     api/user/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/user/export/report/pdf', authenticated, acl, institutionMiddleware, user.exportPdfReport)

/**
 * @access    Private
 * @route     GET api/user/export/report/pdf/:uuid
 * @desc      get single record.
 * @params    id.
 */
router.get('/user/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, user.exportPdfReportDetail)

export default router
