import * as childInterview from './../controllers/childInterview'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/child/interview
 *@desc      get all the records.
 *@params    none.
 */
router.get(
  '/child/interview',
  authenticated,
  acl,
  institutionMiddleware,
  childInterview.index
)

/**
 * @access    Private
 * @route     GET api/child/interview/partner/:uuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get(
  '/child/interview/partner/:uuid',
  authenticated,
  acl,
  institutionMiddleware,
  childInterview.getAllPartnerChildInterview
)

/**
 *@access    Private
 *@route     GET api/child/interview/:uuid
 *@desc      get single record.
 *@params    uuid
 */
router.get(
  '/child/interview/:uuid',
  authenticated,
  acl,
  institutionMiddleware,
  childInterview.show
)

/**
 *@access    Private
 *@route     POST api/childInterview
 *@desc      create a record.
 *@params    Object.
 */
router.post('/child/interview', authenticated, acl, childInterview.create)

/**
 *@access    Private
 *@route     POST api/child/interview/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/child/interview/validate', authenticated, childInterview.validate)

/**
 * @access    Private
 * @route     PUT api/child/interview/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/child/interview/:uuid', authenticated, acl, childInterview.update)

/**
 *@access    Private
 *@route     PUT api/child/interview/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/child/interview/toggle/:uuid', authenticated, acl, childInterview.toggle)

/**
 *@access    Private
 *@route     DELETE api/child/interview/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/child/interview/:uuid', authenticated, acl, childInterview.destroy)

/**
 *@access    Private
 *@route     /child/interview//export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get(
  '/child/interview/export/report/pdf/:uuid',
  authenticated, acl,
  childInterview.exportPdfReportDetail
)

export default router
