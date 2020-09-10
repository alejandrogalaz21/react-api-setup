import * as program from './../controllers/program'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/program
 *@desc      get all the records.
 *@params    none.
 */
router.get('/program', authenticated, acl, program.index)

/**
 *@access    Private
 *@route     GET api/program/:uuid
 *@desc      get single record.
 *@params    uuid
 */
router.get('/program/:uuid', authenticated, acl, program.show)

/**
 *@access    Private
 *@route     POST api/program
 *@desc      create a record.
 *@params    Object.
 */
router.post('/program', authenticated, acl, program.create)

/**
 *@access    Private
 *@route     POST api/program/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/program/validate', authenticated, program.validate)

/**
 * @access    Private
 * @route     PUT api/program/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/program/:uuid', authenticated, acl, program.update)

/**
 *@access    Private
 *@route     PUT api/program/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/program/toggle/:uuid', authenticated, acl, program.toggle)

/**
 *@access    Private
 *@route     DELETE api/program/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/program/:uuid', authenticated, acl, program.destroy)

/**
 *@access    Private
 *@route     /program/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/program/export/report/pdf', authenticated, acl, program.exportPdfReport)

/**
 *@access    Private
 *@route     /program/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/program/export/report/pdf/:uuid', authenticated, acl, program.exportPdfReportDetail)

export default router
