import * as familyInterview from './../controllers/familyInterview'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/family/interview
 *@desc      get all the records.
 *@params    none.
 */
router.get('/family/interview', authenticated, acl, institutionMiddleware, familyInterview.index)

/**
 * @access    Private
 * @route     GET api/family/interview/partner/:uuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/family/interview/partner/:uuid', authenticated, acl, institutionMiddleware, familyInterview.getByPartner)

/**
 *@access    Private
 *@route     GET api/family/interview/:uuid
 *@desc      get single record.
 *@params    uuid
 */
router.get('/family/interview/:uuid', authenticated, acl, institutionMiddleware, familyInterview.show)

/**
 *@access    Private
 *@route     POST api/familyInterview
 *@desc      create a record.
 *@params    Object.
 */
router.post('/family/interview', authenticated, acl, familyInterview.create)

/**
 *@access    Private
 *@route     POST api/family/interview/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/family/interview/validate', authenticated, familyInterview.validate)

/**
 * @access    Private
 * @route     PUT api/family/interview/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/family/interview/:uuid', authenticated, acl, familyInterview.update)

/**
 *@access    Private
 *@route     PUT api/family/interview/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/family/interview/toggle/:uuid', authenticated, acl, familyInterview.toggle)

/**
 *@access    Private
 *@route     DELETE api/family/interview/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/family/interview/:uuid', authenticated, acl, familyInterview.destroy)

/**
 *@access    Private
 *@route     /family/interview/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/family/interview/export/report/pdf/:uuid', authenticated, acl, familyInterview.exportPdfReportDetail)

export default router
