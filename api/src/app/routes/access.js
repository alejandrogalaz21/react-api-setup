import * as access from './../controllers/access'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/access
 * @desc      get all the records
 * @params    none
 */
router.get('/access', authenticated, acl, institutionMiddleware, access.index)

/**
 * @access    Private
 * @route     GET api/access/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get(
  '/access/partner/:partneruuid',
  authenticated,
  acl,
  institutionMiddleware,
  access.getByPartner
)

/**
 * @access    Private
 * @route     GET api/access/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/access/partner/:partneruuid/report/pdf/', access.exportPdfReportByPartner)

/**
 * @access    Private
 * @route     GET api/access/:partneruuid
 * @desc      get the type of the access
 * @params    uuid
 */
router.get('/access/type/:partneruuid', authenticated, acl, access.getType)

/**
 * @access    Private
 * @route     GET api/access/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/access/:uuid', authenticated, acl, institutionMiddleware, access.show)

/**
 * @access    Private
 * @route     POST api/access
 * @desc      create a record
 * @params    Object
 */
router.post('/access', authenticated, acl, access.create)

/**
 *@access    Private
 *@route     POST api/access/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/access/validate', authenticated, acl, access.validate)

/**
 * @access    Private
 * @route     PUT api/access/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/access/:uuid', authenticated, acl, access.update)

/**
 *@access    Private
 *@route     PUT api/access/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/access/toggle/:uuid', authenticated, acl, access.toggle)

/**
 *@access    Private
 *@route     DELETE api/access/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/access/:uuid', authenticated, acl, access.destroy)

/**
 *@access    Private
 *@route     /access/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/access/export/report/pdf', authenticated, acl, institutionMiddleware, access.exportPdfReport)

export default router
