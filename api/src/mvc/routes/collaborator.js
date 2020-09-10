import * as collaborator from './../controllers/collaborator'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/collaborator
 *@desc      get all the records.
 *@params    none.
 */
router.get('/collaborator', authenticated, acl, collaborator.index)

/**
 *@access    Private
 *@route     GET api/collaborator/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/collaborator/:uuid', authenticated, acl, collaborator.show)

/**
 *@access    Private
 *@route     POST api/collaborator
 *@desc      create a record.
 *@params    Object.
 */
router.post('/collaborator', authenticated, acl, collaborator.create)

/**
 *@access    Private
 *@route     POST api/collaborator/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/collaborator/validate', authenticated, collaborator.validate)

/**
 * @access    Private
 * @route     PUT api/collaborator/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/collaborator/:uuid', authenticated, acl, collaborator.update)

/**
 *@access    Private
 *@route     PUT api/collaborator/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/collaborator/toggle/:uuid', authenticated, acl, collaborator.toggle)

/**
 *@access    Private
 *@route     DELETE api/collaborator/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/collaborator/:uuid', authenticated, acl, collaborator.destroy)

export default router
