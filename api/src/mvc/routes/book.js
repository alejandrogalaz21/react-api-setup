import * as book from './../controllers/book'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 *@access    Private
 *@route     GET api/book
 *@desc      get all the records.
 *@params    none.
 */
router.get('/book', authenticated, acl, institutionMiddleware, book.index)

/**
 *@access    Private
 *@route     GET api/book/uuid
 *@desc      get single record.
 *@params    uuid.
 */
router.get('/book/:uuid', authenticated, acl, institutionMiddleware, book.show)

/**
 *@access    Private
 *@route     POST api/book
 *@desc      create a record.
 *@params    Object.
 */
router.post('/book', authenticated, acl, book.create)

/**
 *@access    Private
 *@route     POST api/book/validate
 *@desc      validate a record.
 *@params    Object.
 */
router.post('/book/validate', authenticated, book.validate)

/**
 * @access    Private
 * @route     PUT api/book/uuid
 * @desc      update a record.
 * @params    uuid, Object.
 */
router.put('/book/:uuid', authenticated, acl, book.update)

/**
 *@access    Private
 *@route     PUT api/book/toggle/:uuid
 *@desc      toggle (active/inactive) a record
 *@params    uuid, Object.
 */
router.put('/book/toggle/:uuid', authenticated, acl, book.toggle)

/**
 *@access    Private
 *@route     DELETE api/book/:uuid
 *@desc      delete a record
 *@params    uuid, Object.
 */
router.delete('/book/:uuid', authenticated, acl, book.destroy)

/**
 *@access    Private
 *@route     /book/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/book/export/report/pdf', authenticated, acl, institutionMiddleware, book.exportPdfReport)

/**
 *@access    Private
 *@route     /book/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/book/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, book.exportPdfReportDetail)

export default router
