import * as academicHistory from './../controllers/academicHistory'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/academic-history
 * @desc      get all the records
 * @params    none
 */
router.get('/academic-history', authenticated, acl, institutionMiddleware, academicHistory.index)

/**
 * @access    Private
 * @route     GET api/academic-history/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get(
	'/academic-history/partner/:partneruuid',
	authenticated,
	acl,
	institutionMiddleware,
	academicHistory.getByPartner
)

/**
 * @access    Private
 * @route     GET api/academic-history/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/academic-history/partner/:partneruuid/report/pdf', authenticated, acl, academicHistory.exportPdfReportByPartner)

/**
 * @access    Private
 * @route     GET api/academic-history/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/academic-history/:uuid', authenticated, acl, institutionMiddleware, academicHistory.show)

/**
 * @access    Private
 * @route     POST api/academic-history
 * @desc      create a record
 * @params    Object
 */
router.post('/academic-history', authenticated, acl, academicHistory.create)

/**
 *@access    Private
 *@route     POST api/academic-history/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/academic-history/validate', authenticated, academicHistory.validate)

/**
 * @access    Private
 * @route     PUT api/academic-history/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/academic-history/:uuid', authenticated, acl, academicHistory.update)

/**
 *@access    Private
 *@route     PUT api/academic-history/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/academic-history/toggle/:uuid', authenticated, acl, academicHistory.toggle)

/**
 *@access    Private
 *@route     DELETE api/academic-history/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/academic-history/:uuid', authenticated, acl, academicHistory.destroy)

/**
 *@access    Private
 *@route     api/academic-history/:uuid
 *@desc      get a record
 *@params    uuid, Object
 */
router.get('/academic-history/export/report/pdf/:uuid', authenticated, acl, academicHistory.exportPdfReportDetail)

export default router
