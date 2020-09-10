import FamilyInterview from '../models/familyInterview'

// Get users documents based on query
export async function getfamilyInterview(query, populate) {
	const result = await FamilyInterview.findOne(query)
		.select('-detail')
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')

	return result
}
