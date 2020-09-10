import * as diagnosticEvaluation from './../controllers/diagnosticEvaluation'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/diagnostic/evaluation
 *@desc      get all the records.
 *@params    none.
 */
router.get(
  '/diagnostic/evaluation',
  authenticated,
  acl,
  institutionMiddleware,
  diagnosticEvaluation.index
)

/**
 * @access    Private
 * @route     GET api/diagnostic/evaluation/partner/:uuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get(
  '/diagnostic/evaluation/partner/:uuid',
  authenticated,
  acl,
  institutionMiddleware,
  diagnosticEvaluation.getByPartner
)

/**
 *@access    Private
 *@route     GET api/diagnostic/evaluation/:uuid
 *@desc      get single record.
 *@params    uuid
 */
router.get(
  '/diagnostic/evaluation/:uuid',
  authenticated,
  acl,
  institutionMiddleware,
  diagnosticEvaluation.show
)

/**
 *@access    Private
 *@route     POST api/diagnosticEvaluation
 *@desc      create a record.
 *@params    Object.
 */
router.post('/diagnostic/evaluation', authenticated, acl, diagnosticEvaluation.create)

/**
 *@access    Private
 *@route     POST api/diagnostic/evaluation/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post(
  '/diagnostic/evaluation/validate',
  authenticated,
  diagnosticEvaluation.validate
)

/**
 * @access    Private
 * @route     PUT api/diagnostic/evaluation/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put(
  '/diagnostic/evaluation/:uuid',
  authenticated,
  acl,
  diagnosticEvaluation.update
)

/**
 *@access    Private
 *@route     PUT api/diagnostic/evaluation/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put(
  '/diagnostic/evaluation/toggle/:uuid',
  authenticated,
  acl,
  diagnosticEvaluation.toggle
)

/**
 *@access    Private
 *@route     DELETE api/diagnostic/evaluation/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete(
  '/diagnostic/evaluation/:uuid',
  authenticated,
  acl,
  diagnosticEvaluation.destroy
)

/**
 *@access    Private
 *@route     /diagnostic/evaluation/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get(
  '/diagnostic/evaluation/export/report/pdf/:uuid',
  authenticated,
  acl,
  diagnosticEvaluation.exportPdfReportDetail
)

export default router
