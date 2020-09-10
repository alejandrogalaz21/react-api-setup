import * as activity from './../controllers/activity'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/activity
 *@desc      get all the records.
 *@params    none.
 */
router.get('/activity', authenticated, acl, activity.index)

/**
 *@access    Private
 *@route     GET api/activity/:uuid
 *@desc      get single record.
 *@params    uuid
 */
router.get('/activity/:uuid', authenticated, acl, activity.show)

/**
 *@access    Private
 *@route     POST api/activity
 *@desc      create a record.
 *@params    Object.
 */
router.post('/activity', authenticated, acl, activity.create)

/**
 *@access    Private
 *@route     POST api/activity/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/activity/validate', authenticated, activity.validate)

/**
 * @access    Private
 * @route     PUT api/activity/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/activity/:uuid', authenticated, acl, activity.update)

/**
 *@access    Private
 *@route     PUT api/activity/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/activity/toggle/:uuid', authenticated, acl, activity.toggle)

/**
 *@access    Private
 *@route     DELETE api/activity/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/activity/:uuid', authenticated, acl, activity.destroy)

export default router
