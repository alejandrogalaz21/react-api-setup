import * as position from './../controllers/position'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/position
 *@desc      get all the records.
 *@params    none.
 */
router.get('/position', authenticated, acl, position.index)

/**
 *@access    Private
 *@route     GET api/position/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/position/:uuid', authenticated, acl, position.show)

/**
 *@access    Private
 *@route     POST api/position
 *@desc      create a record.
 *@params    Object.
 */
router.post('/position', authenticated, acl, position.create)

/**
 *@access    Private
 *@route     POST api/position/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/position/validate', authenticated, position.validate)

/**
 * @access    Private
 * @route     PUT api/position/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/position/:uuid', authenticated, acl, position.update)

/**
 *@access    Private
 *@route     PUT api/position/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/position/toggle/:uuid', authenticated, acl, position.toggle)

/**
 *@access    Private
 *@route     DELETE api/position/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/position/:uuid', authenticated, acl, position.destroy)

/**
 *@access    Private
 *@route     /position/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/position/export/report/pdf', authenticated, acl, position.exportPdfReport)

/**
 *@access    Private
 *@route     /position/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/position/export/report/pdf/:uuid', authenticated, acl, position.exportPdfReportDetail)

export default router
