import * as areas from './../controllers/areas'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/areas
 *@desc      get all the records.
 *@params    none.
 */
router.get('/areas', authenticated, acl, areas.index)

/**
 *@access    Private
 *@route     GET api/area/:uuid
 *@desc      get single record.
 *@params    uuid
 */
router.get('/areas/:uuid', authenticated, acl, areas.show)

/**
 *@access    Private
 *@route     POST api/area
 *@desc      create a record.
 *@params    Object.
 */
router.post('/areas', authenticated, acl, areas.create)

/**
 *@access    Private
 *@route     POST api/areas/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/areas/validate', authenticated, areas.validate)

/**
 * @access    Private
 * @route     PUT api/area/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/areas/:uuid', authenticated, acl, areas.update)

/**
 *@access    Private
 *@route     PUT api/area/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/areas/toggle/:uuid', authenticated, acl, areas.toggle)

/**
 *@access    Private
 *@route     DELETE api/area/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/areas/:uuid', authenticated, acl, areas.destroy)

/**
 *@access    Private
 *@route     /areas/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/areas/export/report/pdf', authenticated, acl, areas.exportPdfReport)

/**
 *@access    Private
 *@route     /areas/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/areas/export/report/pdf/:uuid', authenticated, acl, areas.exportPdfReportDetail)

export default router
