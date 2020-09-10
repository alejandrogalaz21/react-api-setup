import Partner from './../models/partner'
import Access from './../models/access'
import Group from './../models/group'
import { calculateAge } from './../../util/dates'
import { isEmpty } from './../../util'
import { diffBusinessDays } from './../../util/dates'

// Get fee documents based on query
export async function getPartner(query, select) {
	const result = await Partner.find(query)
		.populate('group', 'name color')
		.populate('thumbnail', 'path')
		.populate('security', 'question3')
		.populate('school', 'name')
		.populate('detail.created_by', 'name lastName')
		.select(select + 'detail createdAt address genre category security foodProgram')
		.sort({ updatedAt: -1 })

	return result
}

// Return partners whose group must be changed because exceed the age limit
export async function getPartnersToChangeGroup(date, group, institutionQuery) {
	let result = []
	let query = { category: 'Socio' }

	if (!isEmpty(group)) query.group = group

	const partners = await Partner.find({ ...query, ...institutionQuery })
		.populate('group', 'name ageMin ageMax color')
		.populate('institution', 'name')
		.populate('thumbnail', 'path')
		.lean()

	for (const partner of partners) {
		const age = calculateAge(partner.birthDate, date)

		// Partner exceed the maximum age of its current group
		if (partner.group.ageMax < age) {
			// Search a new group considering the age limit
			const newGroup = await Group.findOne({
				ageMin: { $lte: age },
				ageMax: { $gte: age }
			}).lean()

			result.push({ ...partner, date, newGroup })
		}
	}

	return result
}

// Return partners whose birthday are in a specific month
export async function getPartnerBirthdays(month, institution, shift, institutionQuery) {
	let result = []

	let [payload] = await Partner.aggregate([
		{ $project: { month: { $month: '$birthDate' } } },
		{ $match: { month } },
		{ $group: { _id: null, partners: { $push: '$_id' } } },
		{ $project: { _id: false } }
	])

	if (payload && payload.partners) {
		const query = { _id: { $in: payload.partners }, status: 1, category: 'Socio' }

		if (!isEmpty(institution)) query.institution = institution
		if (!isEmpty(shift)) query.shift = shift

		result = await Partner.find({ ...query, ...institutionQuery })
			.populate('group', 'name color')
			.populate('institution', 'name')
			.populate('thumbnail', 'path')
			.select('name lastName id shift institution group birthDate thumbnail')
			.sort({ birthDate: -1 })
			.lean()
	}

	return result
}

// Get partner detail documents based on query
export async function getPartnerDetail(query, populate) {
	const result = await await Partner.findOne(query)
		.populate('created_by updated_by', 'name lastName')
		.populate(populate)

	return result
}


// Return all partners whose non-attendance reaches 15 business days
export async function getNonAttendances(date, group, institution, institutionQuery) {
	let result = []
	let baseDate = new Date(date).toISOString()
	let query = { category: 'Socio', status: 1, ...institutionQuery }

	if (!isEmpty(institution)) query.institution = institution
	if (!isEmpty(group)) query.group = group

	const partners = await Partner.find(query)
		.populate('group', 'name color')
		.populate('institution', 'name')
		.populate('thumbnail', 'path')
		.select('name lastName id shift institution group birthDate thumbnail')
		.lean()

	for (const partner of partners) {
		const lastAccess = await Access
			.findOne({ partner: partner._id })
			.sort({ date: -1 })
			.limit(1)

		const daysFromLastAccess = diffBusinessDays(lastAccess.date, baseDate)
		if (daysFromLastAccess >= 15) {
			result.push({ partner, date, last: lastAccess.date, daysFromLastAccess })
		}
	}

	return result
}
