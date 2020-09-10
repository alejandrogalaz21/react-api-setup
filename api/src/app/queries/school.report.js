import School from './../models/school'

// Get School documents based on query
export async function getSchool(query) {
	const result = await School.find(query)
		.sort({ updatedAt: -1 })
		.populate('detail.created_by', 'name lastName')
		.select('uuid name phone active grade address comments createdAt detail')
		.lean()

	return result
}

export async function getSchoolDetail(query) {
	const result = await School.findOne(query)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()

	return result
}
