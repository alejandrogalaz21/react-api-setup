import Partner from '../models/partner'
import Access from '../models/access'
import { isEmpty } from '../../util'
import { addFilters } from '../../util/reports'

export async function getAttendanceByDates(filters, institutionQuery) {
  let result = []

  let partnerQuery = addFilters(filters, 'shift', 'group', 'institution')
  const accessQuery = {
    date: {
      $gte: new Date(filters.start),
      $lte: new Date(filters.end)
    }
  }

  // If exists, add filter name regex for partner's query
  if (!isEmpty(filters.name)) {
    const regex = new RegExp(filters.name, 'i')
    const nameRegex = { $regex: regex }
    const regexQuery = { $or: [{ name: nameRegex }, { lastName: nameRegex }] }
    partnerQuery = { ...partnerQuery, ...regexQuery }
  }

  if (filters.entry) {
    accessQuery.entry = filters.entry === 'true'
  }

  // Find partners with the defined queries
  const partners = await Partner.find(partnerQuery).distinct('_id')

  result = await Access.find({
    ...accessQuery,
    ...institutionQuery,
    partner: { $in: partners }
  })
    .populate({
      path: 'partner',
      select: 'name lastName id shift institution group thumbnail',
      populate: [
        { path: 'group', select: 'name color' },
        { path: 'institution', select: 'name' },
        { path: 'thumbnail', select: 'path' }
      ]
    })
    .select('date entry exit partner')
    .sort({ date: -1 })
    .lean()

  return result
}
