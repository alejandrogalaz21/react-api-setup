import * as dropout from './../controllers/dropout'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/dropout
 * @desc      get all the records
 * @params    none
 */
router.get('/dropout', authenticated, acl, dropout.index)

/**
 * @access    Private
 * @route     GET api/dropout/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/dropout/:uuid', authenticated, acl, dropout.show)

/**
 * @access    Private
 * @route     POST api/dropout
 * @desc      create a record
 * @params    Object
 */
router.post('/dropout', authenticated, acl, dropout.create)

/**
 *@access    Private
 *@route     POST api/dropout/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/dropout/validate', authenticated, dropout.validate)

/**
 * @access    Private
 * @route     PUT api/dropout/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/dropout/:uuid', authenticated, acl, dropout.update)

/**
 *@access    Private
 *@route     PUT api/dropout/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/dropout/toggle/:uuid', authenticated, acl, dropout.toggle)

/**
 *@access    Private
 *@route     DELETE api/dropout/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/dropout/:uuid', authenticated, acl, dropout.destroy)

/**
 *@access    Private
 *@route     /dropout/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/dropout/export/report/pdf', authenticated, acl, dropout.exportPdfReport)

/**
 *@access    Private
 *@route     /dropout/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/dropout/export/report/pdf/:uuid', authenticated, acl, dropout.exportPdfReportDetail)

export default router
