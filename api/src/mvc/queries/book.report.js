import Book from './../models/book'

// Get book documents based on query
export async function getBook(query, populate) {
	const result = await Book.find(query)
		.sort({ updatedAt: -1 })
		.populate(populate)
		.populate('detail.created_by', 'name lastName')
		.select('-created_by -updated_by')
		.lean()

	return result
}

export async function getBookDetail(query, populate) {
	const result = await Book.findOne(query)
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
		.lean()

	return result
}
