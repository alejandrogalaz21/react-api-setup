import * as institution from './../controllers/institution'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/institution
 * @desc      get all the records
 * @params    none
 */
router.get('/institution', authenticated, acl, institution.index)

/**
 * @access    Private
 * @route     GET api/institution/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/institution/:uuid', authenticated, acl, institution.show)

/**
 * @access    Private
 * @route     POST api/institution
 * @desc      create a record
 * @params    Object
 */
router.post('/institution', authenticated, acl, institution.create)

/**
 *@access    Private
 *@route     POST api/institution/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/institution/validate', authenticated, institution.validate)

/**
 * @access    Private
 * @route     PUT api/institution/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/institution/:uuid', authenticated, acl, institution.update)

/**
 *@access    Private
 *@route     PUT api/institution/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/institution/toggle/:uuid', authenticated, acl, institution.toggle)

/**
 *@access    Private
 *@route     DELETE api/institution/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/institution/:uuid', authenticated, acl, institution.destroy)

/**
 *@access    Private
 *@route     /institution/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/institution/export/report/pdf', authenticated, acl, institution.exportPdfReport)

/**
 *@access    Private
 *@route     /institution/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/institution/export/report/pdf/:uuid', authenticated, acl, institution.exportPdfReportDetail)

export default router
