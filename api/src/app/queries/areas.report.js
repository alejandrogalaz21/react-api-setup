import Areas from './../models/areas'

// Get Areas documents based on query
export async function getAreas(query) {
	const result = await Areas.find(query).sort({ updatedAt: -1 }).populate('detail.created_by', 'name lastName').lean()

	return result
}

// Get Area documents based on query
export async function getAreasDetail(query) {
	const result = await Areas.findOne(query)
		.select('-detail')
		.populate('created_by updated_by', 'name lastName')
		.lean()

	return result
}
