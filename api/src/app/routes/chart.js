import * as chart from '../controllers/chart'
import { Router } from 'express'
import { authenticated, institutionMiddleware, acl } from '../middlewares'

const router = new Router()

/**
 * @access    Private
 * @route     GET api/chart/groups
 * @desc      Retrieve all groups with its partners
 * @params    None.
 */
router.get('/chart/groups', authenticated, chart.getPartnersByGroups)

/**
 * @access    Private
 * @route     GET api/chart/fees
 * @desc      Retrieve all fee with its amount by concept
 * @params    None.
 */
router.get('/chart/fees', authenticated, chart.getLastFees)

/**
 * @access    Private
 * @route     GET api/chart/accesses
 * @desc      Retrieve latest accesses records
 * @params    None.
 */
router.get('/chart/accesses', authenticated, chart.getLastAccesses)

/**
 * @access    Private
 * @route     GET api/chart/birthdays
 * @desc      Retrieve latest birthdays records
 * @params    None.
 */
router.get('/chart/birthdays', authenticated, chart.getPartnersBirthdays)

export default router
