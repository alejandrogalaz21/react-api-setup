import * as input from './../controllers/input'
import { Router } from 'express'
import { authenticated, institutionMiddleware } from './../middlewares'
import { filterMiddleware } from './../middlewares/institutionMiddleware'

const filterUsers = filterMiddleware('institutions')
const router = new Router()

/**
 * @access    Private
 * @route     GET api/input/partner
 * @desc      get the partners record with the corresponding id or name
 * @params    none
 */
router.get(
  '/input/autocomplete/partner',
  authenticated,
  institutionMiddleware,
  input.getAutocompletePartner
)

/**
 * @access    Private
 * @route     GET api/input/book
 * @desc      get the books record with the corresponding id or name
 * @params    none
 */
router.get('/input/autocomplete/book', authenticated, input.getAutocompleteBook)

/**
 * @access    Private
 * @route     GET api/input/event/
 * @desc      get the event records
 * @params    none
 */
router.get(
  '/input/valid/event',
  authenticated,
  institutionMiddleware,
  input.getAllValidEvent
)

/**
 * @access    Private
 * @route     GET api/input/areas
 * @desc      get the areas records
 * @params    none
 */
router.get('/input/areas', authenticated, input.getAllAreas)

/**
 * @access    Private
 * @route     GET api/input/category
 * @desc      get the category records
 * @params    none
 */
router.get('/input/category', authenticated, institutionMiddleware, input.getAllCategory)

/**
 * @access    Private
 * @route     GET api/input/school
 * @desc      get the school records
 * @params    none
 */
router.get('/input/school', authenticated, institutionMiddleware, input.getAllSchool)

/**
 * @access    Private
 * @route     GET api/input/group
 * @desc      get the group records
 * @params    none
 */
router.get('/input/group', authenticated, input.getAllGroup)

/**
 * @access    Private
 * @route     GET api/input/institution
 * @desc      get the institution records
 * @params    none
 */
router.get('/input/institution', authenticated, input.getAllInstitution)

/**
 * @access    Private
 * @route     GET api/input/user
 * @desc      get the user records
 * @params    none
 */
router.get('/input/user', authenticated, filterUsers, input.getAllUser)

/**
 * @access    Private
 * @route     GET api/input/user/collaborator
 * @desc      get the user collaborator records
 * @params    none
 */
router.get(
  '/input/user/collaborator',
  authenticated,
  filterUsers,
  input.getAllUserCollaborator
)

/**
 * @access    Private
 * @route     GET api/input/partner
 * @desc      get the partner records
 * @params    none
 */
router.get('/input/partner', authenticated, institutionMiddleware, input.getAllPartner)

/**
 * @access    Private
 * @route     GET api/input/program
 * @desc      get the program records
 * @params    none
 */
router.get('/input/program', authenticated, input.getAllProgram)

/**
 * @access    Private
 * @route     GET api/input/bookLocation
 * @desc      get the bookLocation records
 * @params    none
 */
router.get(
  '/input/bookLocation',
  authenticated,
  institutionMiddleware,
  input.getAllBookLocation
)

/**
 * @access    Private
 * @route     GET api/input/position
 * @desc      get the position records
 * @params    none
 */
router.get('/input/position', authenticated, input.getAllPosition)

/**
 * @access    Private
 * @route     GET api/input/assignmentTutor
 * @desc      get the assignmentTutor records
 * @params    none
 */
router.get(
  '/input/assignmentTutor',
  authenticated,
  institutionMiddleware,
  input.getAllAssignmentTutor
)

/**
 * @access    Private
 * @route     GET api/input/assignment-tutor
 * @desc      get the assignmentTutor records
 * @params    none
 */
router.get(
  '/input/assignment-tutor',
  authenticated,
  institutionMiddleware,
  input.getAssignmentTutor
)

/**
 * @access    Private
 * @route     GET api/input/cycle
 * @desc      get the cycle records
 * @params    none
 */
router.get('/input/cycle', authenticated, input.getAllCycle)

/**
 * @access    Private
 * @route     GET api/input/schedule
 * @desc      get the schedule records
 * @params    none
 */
router.get('/input/schedule', authenticated, institutionMiddleware, input.getAllSchedule)

/**
 * @access    Private
 * @route     GET api/input/not-evaluated-positions
 * @desc      filter the position whose evaluation is not submitted
 * @params    none
 */
router.get(
  '/input/not-evaluated-positions/:institutionId',
  authenticated,
  institutionMiddleware,
  input.getAllNotEvaluatedPosition
)

/**
 * @access    Private
 * @route     GET api/input/dropout
 * @desc      get the dropout records
 * @params    none
 */
router.get('/input/dropout', authenticated, input.getAllDropout)

/**
 * @access    Private
 * @route     GET api/input/modules
 * @desc      get the modules records
 * @params    none
 */
router.get('/input/modules', authenticated, input.getAllModules)

/**
 * @access    Private
 * @route     GET api/input/classroom
 * @desc      get the classroom records
 * @params    none
 */
router.get(
  '/input/classroom',
  authenticated,
  institutionMiddleware,
  input.getAllClassroom
)

export default router
