import * as bookLocation from './../controllers/bookLocation'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/bookLocation
 *@desc      get all the records.
 *@params    none.
 */
router.get('/bookLocation', authenticated, acl, institutionMiddleware, bookLocation.index)

/**
 *@access    Private
 *@route     GET api/bookLocation/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/bookLocation/:uuid', authenticated, acl, institutionMiddleware, bookLocation.show)

/**
 *@access    Private
 *@route     POST api/bookLocation
 *@desc      create a record.
 *@params    Object.
 */
router.post('/bookLocation', authenticated, acl, bookLocation.create)

/**
 *@access    Private
 *@route     POST api/bookLocation/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/bookLocation/validate', authenticated, bookLocation.validate)

/**
 * @access    Private
 * @route     PUT api/bookLocation/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/bookLocation/:uuid', authenticated, acl, bookLocation.update)

/**
 *@access    Private
 *@route     PUT api/bookLocation/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/bookLocation/toggle/:uuid', authenticated, acl, bookLocation.toggle)

/**
 *@access    Private
 *@route     DELETE api/bookLocation/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/bookLocation/:uuid', authenticated, acl, bookLocation.destroy)

/**
 *@access    Private
 *@route     /bookLocation/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/bookLocation/export/report/pdf', authenticated, acl, institutionMiddleware, bookLocation.exportPdfReport)

/**
 *@access    Private
 *@route     /bookLocation/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/bookLocation/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, bookLocation.exportPdfReportDetail)

export default router
