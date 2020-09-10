import * as cycle from './../controllers/cycle'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/cycle
 *@desc      get all the records
 *@params    none.
 */
router.get('/cycle', authenticated, acl, cycle.index)

/**
 *@access    Private
 *@route     GET api/cycle/uuid
 *@desc      get single record
 *@params    uuid.
 */
router.get('/cycle/current', authenticated, cycle.showCurrent)

/**
 *@access    Private
 *@route     GET api/cycle/read
 *@desc      get single record
 *@params    uuid.
 */
router.get('/cycle/read', authenticated, cycle.readCycle)

/**
 * @access    Private
 * @route     GET api/cycle/count
 * @desc      get the count of total records
 * @params    none
 */
router.get('/cycle/count', authenticated, cycle.count)

/**
 * @access    Private
 * @route     GET /cycle/close/group-changes
 * @desc      Retrieve all partners that are going to change group
 * @params    None.
 */
router.get('/cycle/close/group-changes', authenticated, acl, cycle.getGroupChange)

/**
 * @access    Private
 * @route     GET /cycle/close/positions-to-evaluate
 * @desc      Retrieve the positions whose evaluation is not submitted
 * @params    None.
 */
router.get('/cycle/close/positions-to-evaluate', authenticated, acl, cycle.getPositionsToEvaluate)

/**
 * @access    Private
 * @route     GET /cycle/close/assignments-to-evaluate
 * @desc      Retrieve the assignments whose evaluation is not submitted
 * @params    None.
 */
router.get('/cycle/close/assignments-to-evaluate', authenticated, acl, cycle.getAssignmentsToEvaluate)

/**
 *@access    Private
 *@route     GET api/cycle/uuid
 *@desc      get single record
 *@params    uuid.
 */
router.get('/cycle/:uuid', authenticated, acl, cycle.show)

/**
 *@access    Private
 *@route     POST api/cycle
 *@desc      create a record
 *@params    Object
 */
router.post('/cycle', authenticated, acl, cycle.create)

/**
 *@access    Private
 *@route     POST api/cycle/validate
 *@desc      validate a record
 *@params    Object
 */
router.post('/cycle/validate', authenticated, cycle.validate)

/**
 * @access    Private
 * @route     POST api/cycle/close/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.post('/cycle/close/:uuid', authenticated, acl, cycle.close)

/**
 * @access    Private
 * @route     PUT api/cycle/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/cycle/:uuid', authenticated, acl, cycle.update)

/**
 *@access    Private
 *@route     PUT api/cycle/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/cycle/toggle/:uuid', authenticated, acl, cycle.toggle)

/**
 *@access    Private
 *@route     DELETE api/cycle/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/cycle/:uuid', authenticated, acl, cycle.destroy)

/**
 *@access    Private
 *@route     /cycle/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/cycle/export/report/pdf', authenticated, acl, cycle.exportPdfReport)

/**
 *@access    Private
 *@route     /cycle/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/cycle/export/report/pdf/:uuid', authenticated, acl, cycle.exportPdfReportDetail)

/**
 *@access    Private
 *@route     /cycle/close/group-changes/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/cycle/close/group-changes/export/report/pdf/:institution', authenticated, acl, cycle.getGroupChangeReport)

export default router
