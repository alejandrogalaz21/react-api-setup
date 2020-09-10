import moment from 'moment'
import AssignmentTutor from './../models/assignmentTutor'
import { isEmpty } from './../../util'
import { updateSchedule } from './../dal/schedule'

// Validate to create or update a schedule document
export function scheduleSaveValidation(Schedule) {
  return async function({ name, assignmentTutor, institution }, uuid) {
    const errors = {}

    if (!name) errors.name = 'El nombre es requerido'
    if (isEmpty(assignmentTutor)) errors.assignmentTutor = 'Campo requerido'
    if (isEmpty(institution)) errors.institution = 'Campo requerido'

    // Asynchronous validations
    const exists = await Schedule.exists({ uuid: { $ne: uuid }, name, institution })
    if (exists) errors.name = 'Este nombre de horario ya existe'

    const assignments = await AssignmentTutor.find({ _id: { $in: assignmentTutor } })
      .populate('program', 'name')
      .populate('user', 'name lastName')
      .lean()

    const conflict = findScheduleConflict(assignments)
    if (conflict) {
      const assignment = getAssignment(conflict.assignment)
      const next = getAssignment(conflict.next)
      errors.name = `Conflicto entre: ${assignment} y ${next}`
    }

    if (institution && uuid != undefined) {
      const userDoc = await AssignmentTutor.find({
        _id: { $in: assignmentTutor }
      }).populate({
        path: 'user',
        select: 'institutions'
        // populate: [{ path: 'institutions', select: 'name' }]
      })
      console.log('institution: ', institution)
      console.log('userDoc: ', userDoc)
      console.log('user: ', JSON.stringify(userDoc, null, 2))
      if (
        !userDoc.every(assignment => assignment.user.institutions.includes(institution))
      ) {
        errors.institution = 'Las asignaciones no corresponden a la sede seleccionada'
      }
    }

    const isValid = isEmpty(errors)
    return { isValid, errors }
  }
}

// Find for an schedule conflict
function findScheduleConflict(assignments) {
  for (const [index, assignment] of assignments.entries()) {
    for (const next of assignments.slice(index + 1)) {
      const insertection = insertectionDates(assignment, next)

      if (insertection) {
        const conflict = insersectHours(assignment.schedule, next.schedule)
        if (conflict) return { assignment, next }
      }
    }
  }
  return false
}

// Find if there is an intersection between two dates/hours
function intersection(fmt = moment.defaultFormat) {
  return function(start1, end1, start2, end2) {
    const mStart1 = moment(start1, fmt),
      mStart2 = moment(start2, fmt)
    const mEnd1 = moment(end1, fmt),
      mEnd2 = moment(end2, fmt)

    const case1 = mStart1.isBetween(mStart2, mEnd2, null, '[]')
    const case2 = mStart2.isBetween(mStart1, mEnd1, null, '[]')

    const isIntersect = case1 || case2
    return isIntersect
  }
}

// Find if there is an intersection between two range of hours
function insersectHours(schedule1, schedule2) {
  for (let i = 0; i < schedule1.length; i++) {
    const { day, startHour, endHour } = schedule1[i]
    const conflict = schedule2.some(insertectionHours(day, startHour, endHour))
    if (conflict) return true
  }
  return false
}

// Find if there is an intersection between two dates
function insertectionDates(date1, date2) {
  const isIntersection = intersection()(
    date1.startDate,
    date1.endDate,
    date2.startDate,
    date2.endDate
  )
  return isIntersection
}

// Find if there is an intersection between two range of hours (callback for array methods)
function insertectionHours(day, startHour, endHour) {
  return function(item) {
    return day === item.day
      ? intersection('hh:mm')(startHour, endHour, item.startHour, item.endHour)
      : false
  }
}

function getAssignment(assignment) {
  return `${assignment.user.name} ${assignment.user.lastName} - ${assignment.program.name}`
}
