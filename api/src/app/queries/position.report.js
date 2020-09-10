import Position from './../models/position'

// Get Positions documents based on query
export async function getPosition(query) {
	const result = await Position.find(query).populate('detail.created_by', 'name lastName').sort({ updatedAt: -1 })

	return result
}

// Get Position documents based on query
export async function getPositionDetail(query) {
	const result = await Position.findOne(query)
		.select('-detail -users')
		.populate('created_by updated_by', 'name lastName')
		.lean()

	return result
}
