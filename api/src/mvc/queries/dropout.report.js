import Dropout from './../models/dropout'

// Get Dropouts documents based on query
export async function getDropout(query, select) {
	const result = await Dropout.find(query)
		.sort({ updatedAt: -1 })
		.populate('detail.created_by', 'name lastName')
		.populate('created_by updated_by', 'name lastName')
		.select(select)
		.lean()
	return result
}

// Get Dropout documents based on query
export async function getDropoutDetail(query) {
	const result = await Dropout.findOne(query)
		.populate({
			path: 'historical.partner',
			populate: { path: 'thumbnail', select: 'path' },
			select: 'uuid id name lastName thumbnail'
		})
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()
	return result
}
