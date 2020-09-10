import * as schedule from './../controllers/schedule'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/schedule
 *@desc      get all the records.
 *@params    none.
 */
router.get('/schedule', authenticated, acl, institutionMiddleware, schedule.index)

/**
 *@access    Private
 *@route     GET api/schedule/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/schedule/:uuid', authenticated, acl, institutionMiddleware, schedule.show)

/**
 *@access    Private
 *@route     POST api/schedule
 *@desc      create a record.
 *@params    Object.
 */
router.post('/schedule', authenticated, acl, schedule.create)

/**
 *@access    Private
 *@route     POST api/schedule/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/schedule/validate', authenticated, schedule.validate)

/**
 * @access    Private
 * @route     PUT api/schedule/uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/schedule/:uuid', authenticated, acl, schedule.update)

/**
 *@access    Private
 *@route     PUT api/schedule/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/schedule/toggle/:uuid', authenticated, acl, schedule.toggle)

/**
 *@access    Private
 *@route     DELETE api/schedule/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/schedule/:uuid', authenticated, acl, schedule.destroy)

/**
 *@access    Private
 *@route     /schedule/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/schedule/export/report/pdf', authenticated, acl, institutionMiddleware, schedule.exportPdfReport)

/**
 *@access    Private
 *@route     /schedule/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/schedule/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, schedule.exportPdfReportDetail)

export default router
