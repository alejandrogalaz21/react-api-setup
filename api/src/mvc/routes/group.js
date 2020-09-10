import * as group from './../controllers/group'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/group
 *@desc      get all the records.
 *@params    none.
 */
router.get('/group', authenticated, acl, group.index)

/**
 *@access    Private
 *@route     GET api/group/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/group/:uuid', authenticated, acl, group.show)

/**
 *@access    Private
 *@route     POST api/group
 *@desc      create a record.
 *@params    Object.
 */
router.post('/group', authenticated, acl, group.create)

/**
 *@access    Private
 *@route     POST api/group/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/group/validate', authenticated, group.validate)

/**
 * @access    Private
 * @route     PUT api/group/uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/group/:uuid', authenticated, acl, group.update)

/**
 *@access    Private
 *@route     PUT api/group/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/group/toggle/:uuid', authenticated, acl, group.toggle)

/**
 *@access    Private
 *@route     DELETE api/group/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/group/:uuid', authenticated, acl, group.destroy)

/**
 *@access    Private
 *@route     /group/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/group/export/report/pdf', authenticated, acl, group.exportPdfReport)

/**
 *@access    Private
 *@route     /group/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/group/export/report/pdf/:uuid', authenticated, acl, group.exportPdfReportDetail)

export default router
