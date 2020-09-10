import * as event from './../controllers/event'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/event
 *@desc      get all the records.
 *@params    none.
 */
router.get('/event', authenticated, acl, institutionMiddleware, event.index)

/**
 *@access    Private
 *@route     GET api/event/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/event/:uuid', authenticated, acl, institutionMiddleware, event.show)

/**
 *@access    Private
 *@route     POST api/event
 *@desc      create a record.
 *@params    Object.
 */
router.post('/event', authenticated, acl, event.create)

/**
 *@access    Private
 *@route     POST api/event/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/event/validate', authenticated, event.validate)

/**
 * @access    Private
 * @route     PUT api/event/uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/event/:uuid', authenticated, acl, event.update)

/**
 *@access    Private
 *@route     PUT api/event/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/event/toggle/:uuid', authenticated, acl, event.toggle)

/**
 *@access    Private
 *@route     DELETE api/event/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/event/:uuid', authenticated, acl, event.destroy)

/**
 *@access    Private
 *@route     /event/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/event/export/report/pdf', authenticated, acl, institutionMiddleware, event.exportPdfReport)

/**
 *@access    Private
 *@route     /event/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/event/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, event.exportPdfReportDetail)

export default router
