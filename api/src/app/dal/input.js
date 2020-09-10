import Daom from './daom'
import Partner from './../models/partner'
import Book from './../models/book'
import Event from './../models/event'
import Areas from './../models/areas'
import Category from './../models/category'
import School from './../models/school'
import Group from './../models/group'
import Institution from './../models/institution'
import User from './../models/user'
import Program from './../models/program'
import BookLocation from './../models/bookLocation'
import Position from './../models/position'
import moment from 'moment'
import { zeroUTC } from './../../util/dates'
import AssignmentTutor from './../models/assignmentTutor'
import Cycle from './../models/cycle'
import Schedule from './../models/schedule'
import TutorEvaluation from './../models/tutorEvaluation'
import Dropout from './../models/dropout'
import Modules from './../models/modules'
import Classroom from './../models/classroom'

const partner = new Daom(Partner)
const book = new Daom(Book)
const event = new Daom(Event)
const areas = new Daom(Areas)
const category = new Daom(Category)
const school = new Daom(School)
const group = new Daom(Group)
const institution = new Daom(Institution)
const user = new Daom(User)
const program = new Daom(Program)
const bookLocation = new Daom(BookLocation)
const position = new Daom(Position)
const assignmentTutor = new Daom(AssignmentTutor)
const cycle = new Daom(Cycle)
const schedule = new Daom(Schedule)
const tutorEvaluation = new Daom(TutorEvaluation)
const dropout = new Daom(Dropout)
const modules = new Daom(Modules)
const classroom = new Daom(Classroom)

const populate = [
  { path: 'school group security institution' },
  { path: 'thumbnail', select: 'path' },
  { path: 'access', options: { sort: { date: -1 } } },
  { path: 'institution', select: 'name' }
]

/**
 * @params     req, res
 * @desc       Filter partner records based on query string (name or id)
 */
export function getAutocompletePartner(filters) {
  const { id, name, ...filter } = filters
  // eslint-disable-next-line security/detect-non-literal-regexp
  const regex = new RegExp(name, 'i')
  const nameRegex = { $regex: regex }
  const status = filters.status ? filters.status : { $nin: [2, 3] }

  const result = name
    ? {
        $or: [{ name: nameRegex }, { lastName: nameRegex }, { id: { $eq: name } }]
      }
    : { id: { $eq: id } }

  const query = { ...result, ...filter, status, category: 'Socio' }
  return partner
    .get(query)
    .populate(populate)
    .limit(5)
}

/**
 * @params     req, res
 * @desc       Filter book records
 */
export function getAutocompleteBook({ isbn, ...filters }) {
  const result = { 'copies.isbn': isbn, ...filters, active: true }
  return book
    .get(result)
    .limit(5)
    .populate([
      { path: 'thumbnail', select: 'path' },
      { path: 'category', select: 'name' },
      { path: 'bookLocation', select: 'name institution' },
      { path: 'institution', select: 'name' }
    ])
}

export function getAllValidEvent(query) {
  const { date, ...filters } = query
  const hour = moment(date).format('HH:mm')
  const utcHour = zeroUTC(date)
  const currentDay = utcHour.format()
  const tomorrow = utcHour.add(1, 'day').format()

  const search = {
    ...filters,
    hour: { $lte: hour },
    date: {
      $gte: currentDay,
      $lt: tomorrow
    },
    active: true
  }

  return event.get(search).populate(populate)
}

/**
 * @params     req, res
 * @desc       Filter active partner records
 */
export function getAllAreas() {
  const result = { active: true }
  return areas
    .get(result)
    .select('name uuid')
    .lean()
}

/**
 * @export
 * @returns
 */
export function getAllCategory(query) {
  const result = { ...query, active: true }
  return category
    .get(result)
    .select('name uuid')
    .lean()
}

/**
 * @params     req, res
 * @desc       Filter active partner records
 */
export function getAllSchool(query) {
  const result = { ...query, active: true }
  return school
    .get(result)
    .select('name uuid')
    .lean()
}

/**
 * @params     req, res
 * @desc       Filter active partner records
 */
export function getAllGroup() {
  const result = { active: true }
  return group
    .get(result)
    .select('name uuid ageMin ageMax')
    .lean()
}

/**
 * @params     req, res
 * @desc       Filter active partner records
 */
export async function getAllInstitution(userId, query) {
  let filter = { active: true }
  const module = query.module

  // Search the user to get its permissions
  const user = await User.findOne({ _id: userId, active: true })
    .populate({ path: 'permissions.permissions', populate: { path: 'module' } })
    .populate({ path: 'permissions.institution' })
    .lean()

  if (user.role !== 0) {
    const institutions = user.permissions.reduce((pre, cur) => {
      const hasPermission = cur.permissions.some(item => {
        const regex = `^${item.module.name}`
        const match = new RegExp(regex, 'i').test(module)
        return match && item.create === true
      })
      if (hasPermission) pre = [...pre, cur.institution._id]
      return pre
    }, [])

    filter._id = { $in: institutions }
  }

  return institution
    .get(filter)
    .select('name uuid code')
    .lean()
}

/**
 * @params     req, res
 * @desc       Filter active partner records
 */
export function getAllUser(query) {
  const result = { ...query, active: true }
  return user
    .get(result)
    .select('name lastName fullName uuid')
    .populate({ path: 'position', select: 'name' })
    .populate({ path: 'institutions', select: 'name' })
}

/**
 * @params     req, res
 * @desc       Filter active user collaborator records
 */
export function getAllUserCollaborator(query) {
  const result = {
    ...query,
    active: true,
    role: { $in: [1, 2] }
  }
  return user
    .get(result)
    .select('name lastName fullName uuid')
    .populate({ path: 'position', select: 'name', match: { name: 'Tutor' } })
    .populate({ path: 'institutions', select: 'name' })
}

/**
 * @params     req, res
 * @desc       Filter active partner records
 */
export function getAllPartner(query) {
  const result = { ...query, active: true, status: 1, category: 'Socio' }
  return partner.get(result)
}

/**
 * @params     req, res
 * @desc       Filter active program records
 */
export function getAllProgram(query) {
  const result = { ...query, active: true }
  return program
    .get(result)
    .select('name uuid')
    .lean()
}

/**
 * @params     req, res
 * @desc       Filter active bookLocation records
 */
export function getAllBookLocation(query) {
  const result = { ...query, active: true }
  return bookLocation
    .get(result)
    .select('location institution')
    .populate({ path: 'institution', select: 'name' })
}

/**
 * @params     req, res
 * @desc       Filter active position records
 */
export function getAllPosition(query) {
  const result = { ...query, active: true }
  return position.get(result).populate({ path: 'users', populate: 'thumbnail' })
}

/**
 * @params     req, res
 * @desc       Filter active assignmentTutor records
 */
export function getAllAssignmentTutor(query) {
  const result = {
    ...query,
    active: true,
    scheduleId: null
  }
  return assignmentTutor
    .get(result)
    .populate('institution', 'name code')
    .select('cycle endDate program schedule scheduleId startDate user institution uuid')
    .populate([
      {
        path: 'user',
        select: 'name lastName fullName uuid institutions',
        populate: [{ path: 'institutions', select: 'name' }]
      },
      {
        path: 'program',
        select: 'name uuid',
        populate: [{ path: 'areas', select: 'color' }]
      }
    ])
}

/**
 * @params     req, res
 * @desc       Filter active cycle records
 */
export function getAllCycle() {
  const result = { active: true }
  return cycle
    .get(result)
    .select('name startDate endDate uuid')
    .lean()
}

/**
 * @params     req, res
 * @desc       Filter active schedule records
 */
export function getAllSchedule(query) {
  const result = { ...query, active: true, programmingId: null }
  return schedule.get(result).populate([
    {
      path: 'assignmentTutor',
      populate: [{ path: 'user' }, { path: 'program', populate: [{ path: 'areas' }] }]
    }
  ])
}

/**
 * @params     req, res
 * @desc       Filter the position whose evaluation is not submitted
 */
export async function getAllNotEvaluatedPosition(query) {
  const { institutionId } = query
  const result = { institution: institutionId, year: new Date().getFullYear() }
  const docs = await tutorEvaluation.get(result).lean()
  const ids = docs.map(({ position }) => position.toString())
  const positionIds = [...new Set(ids)]
  return position.get({ _id: { $nin: positionIds } }).populate({
    path: 'users',
    populate: 'thumbnail',
    match: { institutions: { $in: institutionId } }
  })
}

/**
 * @params     req, res
 * @desc       Filter active assignmentTutor records
 */
export function getAssignmentTutor(query) {
  const result = { ...query, active: true }
  return assignmentTutor
    .get(result)
    .populate([
      { path: 'user', select: 'name lastName fullName' },
      { path: 'program', populate: [{ path: 'areas' }] },
      { path: 'institution', select: 'name code' }
    ])
    .select('-detail')
}

/**
 * @params     req, res
 * @desc       Filter active dropout records
 */
export function getAllDropout() {
  const result = { active: true }
  return dropout.get(result).select('uuid name description')
}

/**
 * @params     req, res
 * @desc       Filter active modules records
 */
export function getAllModules(query) {
  const result = { ...query, active: true }
  return modules.get(result).select('uuid name label')
}

/**
 * @params     req, res
 * @desc       Filter active classroom records
 */
export function getAllClassroom(query) {
  const result = { ...query, active: true }
  return classroom
    .get(result)
    .populate('institution', 'name code')
    .select('uuid name institution')
}
