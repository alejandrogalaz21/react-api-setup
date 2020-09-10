import * as school from './../controllers/school'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/school
 *@desc      get all the records.
 *@params    none.
 */
router.get('/school', authenticated, acl, institutionMiddleware, school.index)

/**
 *@access    Private
 *@route     GET api/school/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/school/:uuid', authenticated, acl, institutionMiddleware, school.show)

/**
 *@access    Private
 *@route     POST api/school
 *@desc      create a record.
 *@params    Object.
 */
router.post('/school', authenticated, acl, school.create)

/**
 *@access    Private
 *@route     POST api/school/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/school/validate', authenticated, school.validate)

/**
 * @access    Private
 * @route     PUT api/school/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/school/:uuid', authenticated, acl, school.update)

/**
 *@access    Private
 *@route     PUT api/school/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/school/toggle/:uuid', authenticated, acl, school.toggle)

/**
 *@access    Private
 *@route     DELETE api/school/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/school/:uuid', authenticated, acl, school.destroy)

/**
 *@access    Private
 *@route     /school/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/school/export/report/pdf', authenticated, acl, institutionMiddleware, school.exportPdfReport)

/**
 *@access    Private
 *@route     /school/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/school/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, school.exportPdfReportDetail)

export default router
