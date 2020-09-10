import TutorEvaluation from './../models/tutorEvaluation'

export async function getTutorEvaluationDetail(query, populate) {
	const result = await TutorEvaluation.findOne(query)
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail -code')
		.lean()

	return result
}
