import AssignmentTutor from './../models/assignmentTutor'

// Get assignmentTutor documents based on query
export async function getAssignmentTutor(query, populate) {
	const result = await AssignmentTutor.find(query)
		.sort({ updatedAt: -1 })
		.select('-evaluated -cycle -schedule')
		.populate(populate)
		.populate('detail.created_by', 'name lastName')

	return result
}

export async function getAssignmentTutorDetail(query, populate) {
	const result = await AssignmentTutor.findOne(query)
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail -evaluated -cycle')
		.lean()

	return result
}
