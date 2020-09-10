import { getAttendanceByDates } from '../queries/attendance.report'
import { getFeeByDates } from '../queries/fee.report'
import { getPartnerBirthdays, getPartnersToChangeGroup, getNonAttendances } from '../queries/partner.report'

// TODO: Validate requerired params in order to execute the queries

// Return all access' documents according the filters
export const getAttendance = async (req, res) => {
  try {
    const result = await getAttendanceByDates(req.body, req.filterQuery)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

// Return all fee's documents according the filters
export const getFee = async (req, res) => {
  try {
    let { start, end, concept } = req.body
    const result = await getFeeByDates(start, end, concept, req.filterQuery)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

// Return partners whose birthday are in a specific month
export const getBirthdays = async (req, res) => {
  try {
    let month = Number(req.body.month)
    const result = await getPartnerBirthdays(
      month,
      req.filterQuery.institution,
      req.body.shift
    )
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// Return partners whose group must be changed because exceed the age limit
export const getGroupChange = async (req, res) => {
  try {
    let result = await getPartnersToChangeGroup(
      req.body.date,
      req.body.group,
      req.filterQuery
    )
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}


// Return all partners whose non-attendance reaches 15 business days
export const getAbsences = async (req, res) => {
  try {
    let result = await getNonAttendances(
      req.body.date,
      req.body.group,
      req.body.institution,
      req.filterQuery
    )
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
