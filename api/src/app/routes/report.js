import * as report from '../controllers/report'
import { Router } from 'express'
import { authenticated, institutionMiddleware, acl } from '../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     POST api/report/attendance
 * @desc      Retrieve all access' documents according the filters
 * @params    None.
 */
router.post('/report/attendance', authenticated, acl, institutionMiddleware, report.getAttendance)

/**
 * @access    Private
 * @route     POST api/report/fee
 * @desc      Retrieve all fee' documents according the filters
 * @params    None.
 */
router.post('/report/fee', authenticated, acl, institutionMiddleware, report.getFee)

/**
 * @access    Private
 * @route     POST api/report/birthdays
 * @desc      Retrieve all partners birthdays of a month
 * @params    None.
 */
router.post('/report/birthday', authenticated, acl, institutionMiddleware, report.getBirthdays)

/**
 * @access    Private
 * @route     POST api/report/group-change
 * @desc      Retrieve all partners that are going to change group
 * @params    None.
 */
router.post('/report/group-change', authenticated, acl, institutionMiddleware, report.getGroupChange)

/**
 * @access    Private
 * @route     POST api/report/absence
 * @desc      Recover all partners whose absence reaches 15 business days
 * @params    None.
 */
router.post('/report/absence', authenticated, acl, institutionMiddleware, report.getAbsences)

export default router
