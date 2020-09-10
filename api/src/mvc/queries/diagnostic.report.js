import diagnosticEvaluation from '../models/diagnosticEvaluation'

// Get users documents based on query
export async function getEvaluationDiagnostic(query, populate) {
  const result = await diagnosticEvaluation
    .findOne(query)
    .select('-detail')
    .populate(populate)
    .populate('created_by updated_by', 'name lastName')

  return result
}
