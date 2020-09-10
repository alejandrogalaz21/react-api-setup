import Partner from './../models/partner'
import PartnerSecurity from './../models/partnerSecurity'
import { saveValidation } from './../validation/partnerSecurity'
import pagination from './../../util/pagination'

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await PartnerSecurity.find()
			.sort({ updatedAt: -1 })
			.lean()
			.populate('detail.created_by', 'name lastName')
		if (req.query.page && req.query.size) {
			payload = await pagination(PartnerSecurity)(req.query)
		}
		return res.status(200).json(payload)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Retrieve a single document in the collection
export const show = async (req, res) => {
	try {
		const doc = await PartnerSecurity.findOne(req.params)
			.populate('created_by updated_by', 'name lastName')
			.select('-detail')
			.lean()
		const partner = await Partner.findOne({ security: doc._id }).select('category').lean()

		const result = { ...doc, category: partner.category }
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Insert a new document into the collection
export const create = async (req, res) => {
	try {
		const request = req.body
		const validate = await saveValidation(PartnerSecurity)(request)
		if (!validate.isValid) return res.status(400).json(validate)
		const payload = await PartnerSecurity.create(request)
		return res.status(200).json(payload)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Validate POST and PUT request before sending those requests
export const validate = async (req, res) => {
	try {
		const request = req.body
		const validate = await saveValidation(PartnerSecurity)(request, request.uuid)
		return res.status(200).json(validate)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Update a document
export const update = async (req, res) => {
	try {
		const updated_by = req.user._id
		let { payload, detail } = req.body
		const query = { uuid: req.params.uuid }

		const validate = await saveValidation(PartnerSecurity)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await PartnerSecurity.findOneAndUpdate(query, data, { new: true })
		await Partner.findByIdAndUpdate(result.partner, { $push: { detail } })
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Logical deletion based on the active property
export const toggle = async (req, res) => {
	try {
		const query = { uuid: req.params.uuid }
		const { active } = await PartnerSecurity.findOne(query)

		const data = { active: !active, $push: { detail: req.body.detail } }
		const result = await PartnerSecurity.findOneAndUpdate(query, data, { new: true })
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Permanently remove a document
export const destroy = async (req, res) => {
	try {
		const query = { uuid: req.params.uuid }
		const result = await PartnerSecurity.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}
