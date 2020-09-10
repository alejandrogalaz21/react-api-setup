import Fee from './../models/fee'
import Partner from './../models/partner'

// Get fee documents based on query
export async function getFee(query, populate, select) {
	const result = await Fee.find(query)
		.populate(populate)
		.populate('detail.created_by', 'name lastName')
		.select(select)
		.sort({ updatedAt: -1 })

	return result
}

// Get fees of a partner
export async function getFeeByPartner(query, populate, select) {
	const partner = await Partner.findOne({ uuid: query.partneruuid })
	const result = await Fee.find({ partner: partner._id })
		.populate(populate)
		.populate('detail.created_by', 'name lastName')
		.select(select)
		.sort({ date: -1 })

	return result
}

export async function getFeeDetail(query, populate, select) {
	const result = await Fee.findOne(query)
		.populate(populate)
		.populate('created_by updated_by', 'name lastName')
		.select(select)
	// .select('-detail')
	return result
}
// Get fees in a range of dates
export async function getFeeByDates(start, end, concept, institutionQuery) {
	let result = []
	let query = {
		date: {
			$gte: new Date(start),
			$lte: new Date(end)
		},
		...institutionQuery
	}

	if (concept) query.concept = concept

	result = await Fee.find(query)
		.populate({
			path: 'partner',
			populate: [
				{ path: 'group', select: 'name color' },
				{ path: 'institution', select: 'name' },
				{ path: 'thumbnail', select: 'path' }
			],
			select: 'name lastName id shift institution group thumbnail'
		})
		.select('amount discount concept date partner')
		.sort({ date: -1 })
		.lean()

	return result
}

// Get sum of amount of every fee's category
export async function getFeeByConcept(query) {
	const data = await Fee.aggregate([{ $match: query }, { $group: { _id: '$concept', total: { $sum: '$amount' } } }])

	const result = {
		labels: data.map((fee) => fee._id),
		datasets: [
			{
				data: data.map((fee) => fee.total),
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
			}
		]
	}

	return result
}
