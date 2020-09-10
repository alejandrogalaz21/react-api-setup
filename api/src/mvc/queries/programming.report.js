import Programming from './../models/programming'

// Get programming documents based on query
export async function getProgramming(query) {
	const result = await Programming.find(query)
		.sort({ updatedAt: -1 })
		.populate('detail.created_by', 'name lastName')
		.populate([
			{ path: 'cycle', select: 'name' },
			{ path: 'group', select: 'name' },
			{ path: 'schedule', select: 'name' }
		])

	return result
}

// Get programming documents based on query
export async function getProgrammingDetail(query, populate) {
	const result = await Programming.findOne(query)
		.populate('created_by updated_by', 'name lastName')
		.populate(populate)
		.select('-detail')
		.lean()

	return result
}
