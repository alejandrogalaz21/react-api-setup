import * as partnerSecurity from './../controllers/partnerSecurity'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/partner/security
 *@desc      get all the records.
 *@params    none.
 */
router.get('/partner/security', authenticated, acl, partnerSecurity.index)

/**
 *@access    Private
 *@route     GET api/partner/security/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/partner/security/:uuid', authenticated, acl, partnerSecurity.show)

/**
 *@access    Private
 *@route     POST api/partner/security
 *@desc      create a record.
 *@params    Object.
 */
router.post('/partner/security', authenticated, acl, partnerSecurity.create)

/**
 *@access    Private
 *@route     POST api/partner/security/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/partner/security/validate', authenticated, partnerSecurity.validate)

/**
 * @access    Private
 * @route     PUT api/partner/security/uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/partner/security/:uuid', authenticated, acl, partnerSecurity.update)

/**
 *@access    Private
 *@route     PUT api/partner/security/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/partner/security/toggle/:uuid', authenticated, acl, partnerSecurity.toggle)

/**
 *@access    Private
 *@route     DELETE api/partner/security/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/partner/security/:uuid', authenticated, acl, partnerSecurity.destroy)

export default router
