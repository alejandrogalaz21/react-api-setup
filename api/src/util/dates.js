import moment from 'moment'

export const mdy = date => moment(date).utc().format('MM/DD/YYYY')
export const hms = date => moment(date).format('h:mm:ss a')
export const zeroUTC = date =>
  moment(date).utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

export const diffWeeks = (start, end) => {
  const mStart = zeroUTC(start)
  const mEnd = zeroUTC(end)
  const difference = mStart.diff(mEnd, 'week')
  return difference
}

// Count the diff. between two dates only considering business days
export const diffBusinessDays = (start, end) => {
  const mStart = zeroUTC(start)
  const mEnd = zeroUTC(end)
  let difference = mEnd.diff(mStart, 'day')
  let businessDays = difference
  while (difference > 0) {
    const date = mStart.add(1, 'days')
    const weekDay = date.isoWeekday()
    if (weekDay === 6 || weekDay === 7) businessDays -= 1
    difference -= 1
  }
  return businessDays
}

/// Calculate age based on the birthday
export const calculateAge = (birthDate, date) => {
  const momentBirthday = moment(birthDate).utc()
  const age = moment(date).diff(momentBirthday, 'year')
  return age
}
