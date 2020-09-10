import Institution from './../models/institution'

// Get Institutions documents based on query
export async function getInstitution(query, select) {
	const result = await Institution.find(query)
		.sort({ updatedAt: -1 })
		.populate('detail.created_by', 'name lastName')
		.select(select)
		.lean()

	return result
}

// Get Institution documents based on query
export async function getInstitutionDetail(query) {
	const result = await Institution.findOne(query)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()

	return result
}
