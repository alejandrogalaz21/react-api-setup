import * as partner from './../controllers/partner'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/partner
 * @desc      get all the records
 * @params    none
 */
router.get('/partner', authenticated, acl, institutionMiddleware, partner.index)

/**
 * @access    Private
 * @route     GET api/partner/information/:uuid
 * @desc      get a single record with just basi information
 * @params    uuid
 */
router.get('/partner/information/:uuid', authenticated, acl, institutionMiddleware, partner.showInformation)

/**
 * @access    Private
 * @route     GET api/partner/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/partner/:uuid', authenticated, acl, institutionMiddleware, partner.show)

/**
 * @access    Private
 * @route     POST api/partner
 * @desc      create a record
 * @params    Object
 */
router.post('/partner', authenticated, acl, partner.create)

/**
 *@access    Private
 *@route     POST api/partner/schedule
 *@desc      schedule a record.
 *@params    Object.
 */
router.post('/partner/schedule', authenticated, partner.showSchedule)

/**
 *@access    Private
 *@route     POST api/partner/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/partner/validate', authenticated, acl, partner.validate)

/**
 * @access    Private
 * @route     PUT api/partner/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/partner/:uuid', authenticated, acl, partner.update)

/**
 * @access    Private
 * @route     PUT api/partner/convert/:uuid
 * @desc      convert a partner from visitor
 * @params    uuid, Object
 */
router.put('/partner/convert/:uuid', authenticated, acl, partner.convertVisitor)

/**
 * @access    Private
 * @route     PUT api/partner/status/dropout/:uuid
 * @desc      set the partner status to "baja", status 2
 * @params    uuid, Object
 */
router.put('/partner/status/dropout/:uuid', authenticated, acl, partner.setDropout)

/**
 * @access    Private
 * @route     PUT api/partner/status/active/:uuid
 * @desc      set the partner status to "activo", status 1
 * @params    uuid, Object
 */
router.put('/partner/status/active/:uuid', authenticated, acl, partner.setActive)

/**
 * @access    Private
 * @route     PUT api/partner/status/graduate/:uuid
 * @desc      set the partner status to "graudado", status 3
 * @params    uuid, Object
 */
router.put('/partner/status/graduate/:uuid', authenticated, acl, partner.setGraduate)

/**
 * @access    Private
 * @route     PUT api/partner/toggle/:uuid
 * @desc      toggle (active/inactive) a record
 * @params    uuid, Object
 */
router.put('/partner/toggle/:uuid', authenticated, acl, partner.toggle)

/**
 * @access    Private
 * @route     DELETE api/partner/:uuid
 * @desc      delete a record
 * @params    uuid, Object
 */
router.delete('/partner/:uuid', authenticated, acl, partner.destroy)

/**
 *@access    Private
 *@route     /partner/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/partner/export/report/pdf', authenticated, acl, institutionMiddleware, partner.exportPdfReport)

/**
 *@access    Private
 *@route     /partner/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/partner/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, partner.exportPdfReportDetail)

export default router
