import * as programming from './../controllers/programming'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/programming
 *@desc      get all the records.
 *@params    none.
 */
router.get('/programming', authenticated, acl, institutionMiddleware, programming.index)

/**
 *@access    Private
 *@route     GET api/programming/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/programming/:uuid', authenticated, acl, institutionMiddleware, programming.show)

/**
 *@access    Private
 *@route     POST api/programming
 *@desc      create a record.
 *@params    Object.
 */
router.post('/programming', authenticated, acl, programming.create)

/**
 *@access    Private
 *@route     POST api/programming/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/programming/validate', authenticated, programming.validate)

/**
 * @access    Private
 * @route     PUT api/programming/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/programming/:uuid', authenticated, acl, programming.update)

/**
 *@access    Private
 *@route     PUT api/programming/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/programming/toggle/:uuid', authenticated, acl, programming.toggle)

/**
 *@access    Private
 *@route     DELETE api/programming/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/programming/:uuid', authenticated, acl, programming.destroy)

/**
 *@access    Private
 *@route     /programming/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/programming/export/report/pdf', authenticated, acl, institutionMiddleware, programming.exportPdfReport)

/**
 *@access    Private
 *@route     /programming/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/programming/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, programming.exportPdfReportDetail)

export default router
