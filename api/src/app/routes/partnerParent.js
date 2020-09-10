import * as partnerParent from './../controllers/partnerParent'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/partner/parent
 *@desc      get all the records.
 *@params    none.
 */
router.get('/partner/parent', authenticated, acl, partnerParent.index)

/**
 * @access    Private
 * @route     GET api/partner/parent/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/partner/parent/partner/:partneruuid', authenticated, acl, partnerParent.getByPartner)

/**
 *@access    Private
 *@route     GET api/partner/parent/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/partner/parent/:uuid', authenticated, acl, partnerParent.show)

/**
 *@access    Private
 *@route     POST api/partner/parent
 *@desc      create a record.
 *@params    Object.
 */
router.post('/partner/parent', authenticated, acl, partnerParent.create)

/**
 *@access    Private
 *@route     POST api/partner/parent/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/partner/parent/validate', authenticated, acl, partnerParent.validate)

/**
 * @access    Private
 * @route     PUT api/partner/parent/uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/partner/parent/:uuid', authenticated, acl, partnerParent.update)

/**
 *@access    Private
 *@route     PUT api/partner/parent/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/partner/parent/toggle/:uuid', authenticated, acl, partnerParent.toggle)

/**
 *@access    Private
 *@route     DELETE api/partner/parent/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/partner/parent/:uuid', authenticated, acl, partnerParent.destroy)

export default router
