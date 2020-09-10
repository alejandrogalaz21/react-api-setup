import Cycle from './../models/cycle'

// Get cycle documents based on query
export async function getCycle(query) {
	const result = await Cycle.find(query).populate('detail.created_by', 'name lastName').sort({ updatedAt: -1 })

	return result
}

export async function getCycleDetail(query) {
	const result = await Cycle.findOne(query)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()

	return result
}
