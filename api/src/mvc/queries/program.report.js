import Program from './../models/program'

// Get program documents based on query
export async function getProgram(query) {
	const result = await Program.find(query)
		.sort({ updatedAt: -1 })
		.populate('areas', 'name color')
		.populate('detail.created_by', 'name lastName')

	return result
}

export async function getProgramDetail(query) {
	const result = await Program.findOne(query)
		.populate('areas', 'name')
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()

	return result
}
