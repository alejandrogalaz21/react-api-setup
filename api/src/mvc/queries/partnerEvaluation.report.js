import PartnerEvaluation from './../models/partnerEvaluation'

export async function getPartnerEvaluationDetail(query, populate) {
	const result = await PartnerEvaluation.findOne(query)
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')

	return result
}
