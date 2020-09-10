import * as assignmentTutor from './../controllers/assignmentTutor'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/assignmentTutor
 *@desc      get all the records.
 *@params    none.
 */
router.get('/assignmentTutor', authenticated, acl, institutionMiddleware, assignmentTutor.index)

/**
 *@access    Private
 *@route     GET api/assignmentTutor/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/assignmentTutor/:uuid', authenticated, acl, institutionMiddleware, assignmentTutor.show)

/**
 *@access    Private
 *@route     POST api/assignmentTutor
 *@desc      create a record.
 *@params    Object.
 */
router.post('/assignmentTutor', authenticated, acl, assignmentTutor.create)

/**
 *@access    Private
 *@route     POST api/assignmentTutor/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/assignmentTutor/validate', authenticated, assignmentTutor.validate)

/**
 * @access    Private
 * @route     PUT api/assignmentTutor/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/assignmentTutor/:uuid', authenticated, acl, assignmentTutor.update)

/**
 *@access    Private
 *@route     PUT api/assignmentTutor/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/assignmentTutor/toggle/:uuid', authenticated, acl, assignmentTutor.toggle)

/**
 *@access    Private
 *@route     DELETE api/assignmentTutor/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/assignmentTutor/:uuid', authenticated, acl, assignmentTutor.destroy)

/**
 *@access    Private
 *@route     /assignmentTutor/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/assignmentTutor/export/report/pdf', authenticated, acl, institutionMiddleware, assignmentTutor.exportPdfReport)

/**
 *@access    Private
 *@route     /assignmentTutor/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/assignmentTutor/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, assignmentTutor.exportPdfReportDetail)

export default router
