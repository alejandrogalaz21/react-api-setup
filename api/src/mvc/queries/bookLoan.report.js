import BookLoan from './../models/bookLoan'
import Partner from './../models/partner'

// Get book documents based on query
export async function getBookLoan(query, populate) {
	const result = await BookLoan.find(query)
		.populate(populate)
		.populate('detail.created_by', 'name lastName')
		.populate('partner', 'uuid name lastName fullName birthDate shift')
		.select('uuid book partner copies returnDate loanDate isbn editorial detail')
		.sort({ updatedAt: -1 })

	return result
}

export async function getBookLoanByPartner(query, populate) {
	const partner = await Partner.findOne({ uuid: query.partneruuid })
	const result = await BookLoan.find({ partner: partner._id })
		.populate(populate)
		.populate('partner', 'uuid name lastName fullName')
		.select('uuid book partner copies returnDate loanDate')
		.sort({ updatedAt: -1 })

	return result
}

export async function getBookLoanByDetail(query, populate, partnerPopulate) {
	const result = await BookLoan.findOne(query)
		.populate({
			...populate,
			select: 'uuid title editorial category author thumbnail copies isbn editorial'
		})
		.populate(partnerPopulate)
		.populate('created_by updated_by', 'name lastName')
		.select('-detail')
	return result
}
