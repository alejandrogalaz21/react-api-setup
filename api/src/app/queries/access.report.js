import Access from './../models/access'
import Partner from './../models/partner'

// Get Access documents based on query
export async function getAccess(query, populate, select) {
	const result = await Access.find(query).populate(populate).select(select).sort({ date: -1 })

	return result
}

export async function getAccessByPartner(query, populate, select) {
	const partner = await Partner.findOne({ uuid: query.partneruuid })
	const result = await Access.find({ partner: partner._id }).populate(populate).select(select).sort({ updatedAt: -1 })

	return result
}
