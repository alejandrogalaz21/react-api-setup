import * as category from './../controllers/category'
import { Router } from 'express'
import { authenticated, acl } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/category
 *@desc      get all the records.
 *@params    none.
 */
router.get('/category', authenticated, acl, category.index)

/**
 *@access    Private
 *@route     GET api/category/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/category/:uuid', authenticated, acl, category.show)

/**
 *@access    Private
 *@route     POST api/category
 *@desc      create a record.
 *@params    Object.
 */
router.post('/category', authenticated, acl, category.create)

/**
 *@access    Private
 *@route     POST api/category/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/category/validate', authenticated, category.validate)

/**
 * @access    Private
 * @route     PUT api/category/:uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/category/:uuid', authenticated, acl, category.update)

/**
 *@access    Private
 *@route     PUT api/category/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object
 */
router.put('/category/toggle/:uuid', authenticated, acl, category.toggle)

/**
 *@access    Private
 *@route     DELETE api/category/:uuid
 *@desc      delete a record
 *@params    uuid, Object
 */
router.delete('/category/:uuid', authenticated, acl, category.destroy)

/**
 *@access    Private
 *@route     /category/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/category/export/report/pdf', authenticated, acl, category.exportPdfReport)

/**
 *@access    Private
 *@route     /category/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/category/export/report/pdf/:uuid', authenticated, acl, category.exportPdfReportDetail)

export default router
