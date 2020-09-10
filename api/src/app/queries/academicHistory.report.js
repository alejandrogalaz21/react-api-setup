import AcademicHistory from './../models/academicHistory'
import Partner from './../models/partner'

// Get book documents based on query
export async function getAcademicHistoryByPartner(query, populate) {
	const partner = await Partner.findOne({ uuid: query.partneruuid })
	const result = await AcademicHistory.find({ partner: partner._id })
		.populate(populate)
		.populate('detail.created_by', 'name lastName')
		.select('uuid partner school shift startDate detail status')
		.sort({ updatedAt: -1 })
		.lean()

	return result
}

export async function getAcademicHistory(query, populate) {
	const result = await AcademicHistory.findOne(query)
		.populate(populate)
		.select('-detail')
		.populate('created_by updated_by', 'name lastName')

	return result
}
