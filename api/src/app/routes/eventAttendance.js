import * as event from './../controllers/eventAttendance'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/event/attendance/:uuid
 * @desc      get a single record with the attendance records
 * @params    uuid.
 */
router.get('/event/attendance/:uuid', authenticated, acl, event.showAttendance)

/**
 * @access    Private
 * @route     POST api/event/entry/:uuid
 * @desc      create an event record entry attendance
 * @params    Object.
 */
router.post('/event/entry/:uuid', authenticated, acl, event.createEntry)

/**
 * @access    Private
 * @route     POST api/event/exit/:uuid
 * @desc      create an event record exit attendance
 * @params    Object.
 */
router.post('/event/exit/:uuid', authenticated, acl, event.createExit)

export default router
