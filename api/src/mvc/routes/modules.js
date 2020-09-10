import * as modules from './../controllers/modules'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/modules
 *@desc      get all the records.
 *@params    none.
 */
router.get('/modules', authenticated, acl, modules.index)

/**
 *@access    Private
 *@route     GET api/modules/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/modules/:uuid', authenticated, acl, modules.show)

/**
 *@access    Private
 *@route     POST api/modules
 *@desc      create a record.
 *@params    Object.
 */
router.post('/modules', authenticated, acl, modules.create)

/**
 *@access    Private
 *@route     POST api/modules/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/modules/validate', authenticated, modules.validate)

/**
 * @access    Private
 * @route     PUT api/modules/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/modules/:uuid', authenticated, acl, modules.update)

/**
 *@access    Private
 *@route     PUT api/modules/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/modules/toggle/:uuid', authenticated, acl, modules.toggle)

/**
 *@access    Private
 *@route     DELETE api/modules/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/modules/:uuid', authenticated, acl, modules.destroy)

export default router
