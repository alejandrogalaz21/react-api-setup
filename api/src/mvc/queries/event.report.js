import Event from '../models/event'

// Get users documents based on query
export async function getEvents(query) {
  const result = await Event.find(query)
    .populate('detail.created_by', 'name lastName')
    .select('uuid name date hour entries active createdAt detail')
    .sort({ updatedAt: -1 })
    .lean()

  return result
}

export async function getEvent(query, populate, select) {
  const result = await Event.findOne(query)
    .select(select)
    .populate('created_by updated_by', 'name lastName')
    .populate(populate)
    .lean()

  return result
}
