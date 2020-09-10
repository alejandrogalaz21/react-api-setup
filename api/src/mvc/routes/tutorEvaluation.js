import * as tutorEvaluation from './../controllers/tutorEvaluation'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/tutor/evaluation
 * @desc      get all the records
 * @params    none
 */
router.get('/tutor/evaluation', authenticated, acl, institutionMiddleware, tutorEvaluation.index)

/**
 * @access    Private
 * @route     GET api/tutor/evaluation/:uuid
 * @desc      get a single record
 * @params    uuid
 */
router.get('/tutor/evaluation/:uuid', authenticated, acl, institutionMiddleware, tutorEvaluation.show)

/**
 * @access    Private
 * @route     POST api/tutor/evaluation
 * @desc      create a record
 * @params    Object
 */
router.post('/tutor/evaluation', authenticated, acl, tutorEvaluation.create)

/**
 *@access    Private
 *@route     POST api/tutor/evaluation/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/tutor/evaluation/validate', authenticated, tutorEvaluation.validate)

/**
 * @access    Private
 * @route     PUT api/tutor/evaluation/:uuid
 * @desc      update a record
 * @params    uuid, Object
 */
router.put('/tutor/evaluation/:uuid', authenticated, acl, tutorEvaluation.update)

/**
 *@access    Private
 *@route     PUT api/tutor/evaluation/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/tutor/evaluation/toggle/:uuid', authenticated, acl, tutorEvaluation.toggle)

/**
 *@access    Private
 *@route     DELETE api/tutor/evaluation/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/tutor/evaluation/:uuid', authenticated, acl, tutorEvaluation.destroy)

/**
 *@access    Private
 *@route     /tutor/evaluation/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/tutor/evaluation/export/report/pdf/:uuid', authenticated, acl, tutorEvaluation.exportPdfReportDetail)

export default router
