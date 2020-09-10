import BookLocation from './../models/bookLocation'

// Get BookLocation documents based on query
export async function getBookLocation(query, populate, select) {
	const result = await BookLocation.find(query)
		.sort({ updatedAt: -1 })
		.populate(populate)
		.populate('detail.created_by', 'name lastName')
		.select(select)
		.lean()
	return result
}

export async function getBookLocationDetail(query, populate) {
	const result = await BookLocation.findOne(query)
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()

	return result
}
