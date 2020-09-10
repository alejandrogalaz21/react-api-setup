import * as fee from './../controllers/fee'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/fee
 * @desc      get all the records
 * @params    none
 */
router.get('/fee', authenticated, acl, institutionMiddleware, fee.index)

/**
 * @access    Private
 * @route     GET api/fee/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get(
  '/fee/partner/:partneruuid',
  authenticated,
  acl,
  institutionMiddleware,
  fee.getByPartner
)

/**
 * @access    Private
 * @route     GET api/fee/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/fee/partner/:partneruuid/report/pdf', fee.exportPdfReportByPartner)
/**
 * @access    Private
 * @route     GET api/fee/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/fee/:uuid', authenticated, acl, institutionMiddleware, fee.show)

/**
 * @access    Private
 * @route     POST api/fee
 * @desc      create a record
 * @params    Object
 */
router.post('/fee', authenticated, acl, fee.create)

/**
 *@access    Private
 *@route     POST api/fee/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/fee/validate', authenticated, fee.validate)

/**
 * @access    Private
 * @route     PUT api/fee/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/fee/:uuid', authenticated, acl, fee.update)

/**
 *@access    Private
 *@route     PUT api/fee/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/fee/toggle/:uuid', authenticated, acl, fee.toggle)

/**
 *@access    Private
 *@route     DELETE api/fee/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/fee/:uuid', authenticated, acl, fee.destroy)

/**
 *@access    Private
 *@route     /fee/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/fee/export/report/pdf', authenticated, acl, institutionMiddleware, fee.exportPdfReport)

/**
 * @access    Private
 * @route     GET api/fee/export/report/pdf/:uuid
 * @desc      get single record.
 * @params    id.
 */
router.get('/fee/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, fee.exportPdfReportDetail)

export default router
