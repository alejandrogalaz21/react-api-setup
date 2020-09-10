import Classroom from './../models/classroom'

// Get Classrooms documents based on query
export async function getClassroom(query) {
	const result = await Classroom.find(query)
		.sort({ updatedAt: -1 })
		.select('name uuid _id detail createAt updateAt active created_by updated_by')
		.populate('institution', 'name')
		.populate('detail.created_by', 'name lastName')
		.lean()

	return result
}

// Get Classroom documents based on query
export async function getClassroomDetail(query) {
	const result = await Classroom.findOne(query)
		.select('-detail')
		.populate('institution', 'name')
		.populate('created_by updated_by', 'name lastName')
		.lean()

	return result
}
