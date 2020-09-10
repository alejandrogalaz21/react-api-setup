import Category from './../models/category'

// Get category documents based on query
export async function getCategory(query) {
	const result = await Category.find(query)
		.sort({ updatedAt: -1 })
		.populate('detail.created_by', 'name lastName')
		.lean()

	return result
}

export async function getCategoryDetail(query) {
	const result = await Category.findOne(query)
		.select('-detail')
		.populate('created_by updated_by', 'name lastName')
		.lean()

	return result
}
