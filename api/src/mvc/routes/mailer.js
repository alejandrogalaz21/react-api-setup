import * as mailer from './../controllers/mailer'
import { Router } from 'express'
import { authenticated, acl } from '../middlewares'
const router = new Router()

/**
 * @access    Private
 * @route     GET api/mailer
 * @desc      get all the records
 * @params    none
 */
router.get('/mailer', authenticated, acl, mailer.index)

/**
 * @access    Private
 * @route     GET api/mailer/:uuid
 * @desc      get the active record
 * @params    uuid
 */
router.get('/mailer/active', authenticated, mailer.getActive)

/**
 * @access    Private
 * @route     GET api/mailer/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/mailer/:uuid', authenticated, acl, mailer.show)

/**
 * @access    Private
 * @route     POST api/mailer
 * @desc      create a record
 * @params    Object
 */
router.post('/mailer', authenticated, acl, mailer.create)

/**
 *@access    Private
 *@route     POST api/mailer/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/mailer/validate', authenticated, mailer.validate)

/**
 * @access    Private
 * @route     PUT api/mailer/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/mailer/:uuid', authenticated, acl, mailer.update)

/**
 *@access    Private
 *@route     PUT api/mailer/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/mailer/toggle/:uuid', authenticated, acl, mailer.toggle)

/**
 *@access    Private
 *@route     DELETE api/mailer/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/mailer/:uuid', authenticated, acl, mailer.destroy)

export default router
