import * as notification from './../controllers/notification'
import { Router } from 'express'
import { authenticated } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/notification
 * @desc      get all the records.
 * @params    none.
 */
router.get('/notification', authenticated, notification.index)

/**
 * @access    Private
 * @route     GET api/notification/uuid
 * @desc      get single record.
 * @params    uuid.
 */
router.get('/notification/:uuid', authenticated, notification.show)

/**
 * @access    Private
 * @route     POST api/notification
 * @desc      create a record.
 * @params    Object.
 */
router.post('/notification', authenticated, notification.create)

/**
 * @access    Private
 * @route     PUT api/notification/uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/notification/:uuid', authenticated, notification.update)

/**
 * @access    Private
 * @route     PUT api/notification/toggle/:uuid
 * @desc      toggle (active/inactive) a record
 * @params    uuid, Object
 */
router.put('/notification/toggle/:uuid', authenticated, notification.toggle)

/**
 * @access    Private
 * @route     DELETE api/notification/:uuid
 * @desc      delete a record
 * @params    uuid, Object
 */
router.delete('/notification/:uuid', authenticated, notification.destroy)

export default router
