import Schedule from './../models/schedule'

// Get schedule documents based on query
export async function getSchedule(query) {
	const result = await Schedule.find(query)
		.select('-assignmentTutor')
		.populate('institution', 'name')
		.populate('detail.created_by', 'name lastName')
		.sort({ updatedAt: -1 })
		.lean()

	return result
}

// Get schedule documents based on query
export async function getScheduleDetail(query, populate) {
	const result = await Schedule.findOne(query)
		.populate(populate)
		.select('-detail')
		.populate('created_by updated_by', 'name lastName')
		.lean()

	return result
}
