import * as bookLoan from './../controllers/bookLoan'
import { Router } from 'express'
import { authenticated, acl, institutionMiddleware } from './../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/book/loan
 * @desc      get all the book loan records.
 * @params    none.
 */
router.get('/book/loan', authenticated, acl, institutionMiddleware, bookLoan.index)

/**
 * @access    Private
 * @route     GET api/book/loan/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/book/loan/partner/:partneruuid', authenticated, acl, institutionMiddleware, bookLoan.getByPartner)

/**
 * @access    Private
 * @route     GET api/book/loan/partner/:partneruuid
 * @desc      get all the records of a partner
 * @params    none
 */
router.get('/book/loan/partner/:partneruuid/report/pdf', authenticated, acl, institutionMiddleware, bookLoan.exportPdfReportByPartner)

/**
 * @access    Private
 * @route     GET api/book/loan/:uuid
 * @desc      get a single record
 * @params    uuid.
 */
router.get('/book/loan/:uuid', authenticated, acl, institutionMiddleware, bookLoan.show)

/**
 * @access    Private
 * @route     POST api/book/loan
 * @desc      create a book loan record
 * @params    Object.
 */
router.post('/book/loan/auto', authenticated, acl, bookLoan.createAuto)

/**
 * @access    Private
 * @route     POST api/book/loan/manual
 * @desc      create a book loan record (manually)
 * @params    Object.
 */
router.post('/book/loan/manual', authenticated, acl, bookLoan.createManual)

/**
 * @access    Private
 * @route     POST api/book/loan
 * @desc      validate a book loan record
 * @params    Object.
 */
router.post('/book/loan/validate', authenticated, bookLoan.validate)

/**
 * @access    Private
 * @route     PUT api/book/laon/:uuid
 * @desc      update the return date of a book loan record
 * @params    uuid, Object.
 */
router.put('/book/loan/:uuid', authenticated, acl, bookLoan.update)

/**
 *@access    Private
 *@route     /book/loan/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/book/loan/export/report/pdf', authenticated, acl, institutionMiddleware, bookLoan.exportPdfReport)

/**
 *@access    Private
 *@route     /book/loan/export/report/pdf
 *@desc      delete a record
 *@params    n/a
 */
router.get('/book/loan/export/report/pdf/:uuid', authenticated, acl, institutionMiddleware, bookLoan.exportPdfReportDetail)

export default router
