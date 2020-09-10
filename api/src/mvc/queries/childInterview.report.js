import childInterview from '../models/childInterview'

// Get users documents based on query
export async function getChildInterview(query, populate) {
	const result = await childInterview
		.findOne(query)
		.select('-detail')
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')

	return result
}
