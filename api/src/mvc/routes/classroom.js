import * as classroom from './../controllers/classroom'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/classroom
 *@desc      get all the records.
 *@params    none.
 */
router.get('/classroom', authenticated, acl, institutionMiddleware, classroom.index)

/**
 *@access    Private
 *@route     GET api/classroom/:uuid
 *@desc      get single record.
 *@params    uuid
 */
router.get('/classroom/:uuid', authenticated, acl, institutionMiddleware, classroom.show)

/**
 *@access    Private
 *@route     POST api/classroom
 *@desc      create a record.
 *@params    Object.
 */
router.post('/classroom', authenticated, acl, classroom.create)

/**
 *@access    Private
 *@route     POST api/classroom/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/classroom/validate', authenticated, classroom.validate)

/**
 * @access    Private
 * @route     PUT api/classroom/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/classroom/:uuid', authenticated, acl, classroom.update)

/**
 *@access    Private
 *@route     PUT api/classroom/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/classroom/toggle/:uuid', authenticated, acl, classroom.toggle)

/**
 *@access    Private
 *@route     DELETE api/classroom/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/classroom/:uuid', authenticated, acl, classroom.destroy)

/**
 *@access    Private
 *@route     /classroom/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/classroom/export/report/pdf', authenticated, acl, institutionMiddleware, classroom.exportPdfReport)

/**
 *@access    Private
 *@route     /classroom/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/classroom/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, classroom.exportPdfReportDetail)

export default router
