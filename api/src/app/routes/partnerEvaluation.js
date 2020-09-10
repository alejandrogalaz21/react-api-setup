import * as partnerEvaluation from './../controllers/partnerEvaluation'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/partner/evaluation
 * @desc      get all the records
 * @params    none
 */
router.get('/partner/evaluation', authenticated, acl, institutionMiddleware, partnerEvaluation.index)

/**
 * @access    Private
 * @route     GET api/partner/evaluation/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/partner/evaluation/partner/:partneruuid', authenticated, acl, institutionMiddleware, partnerEvaluation.getByPartner)

/**
 * @access    Private
 * @route     GET api/partner/evaluation/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/partner/evaluation/:uuid', authenticated, acl, institutionMiddleware, partnerEvaluation.show)

/**
 * @access    Private
 * @route     POST api/partner/evaluation
 * @desc      create a record
 * @params    Object
 */
router.post('/partner/evaluation', authenticated, acl, partnerEvaluation.create)

/**
 *@access    Private
 *@route     POST api/partner/evaluation/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/partner/evaluation/validate', authenticated, partnerEvaluation.validate)

/**
 * @access    Private
 * @route     PUT api/partner/evaluation/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/partner/evaluation/:uuid', authenticated, acl, partnerEvaluation.update)

/**
 * @access    Private
 * @route     PUT api/partner/evaluation/partners
 * @desc      get partners to evaluate
 * @params    uuid, Object
 */
router.post(
	'/partner/evaluation/partners',
	authenticated,
	acl,
	institutionMiddleware,
	partnerEvaluation.getPartnersToEvaluate
)

/**
 *@access    Private
 *@route     PUT api/partner/evaluation/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/partner/evaluation/toggle/:uuid', authenticated, acl, partnerEvaluation.toggle)

/**
 *@access    Private
 *@route     DELETE api/partner/evaluation/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/partner/evaluation/:uuid', authenticated, acl, partnerEvaluation.destroy)

/**
 *@access    Private
 *@route     /partner/evaluation/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/partner/evaluation/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, partnerEvaluation.exportPdfReportDetail)

export default router
