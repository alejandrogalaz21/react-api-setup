import Partner from './../models/partner'
import PartnerParent from './../models/partnerParent'
import { saveValidation } from './../validation/partnerParent'
import pagination from './../../util/pagination'

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await PartnerParent.find()
			.sort({ updatedAt: -1 })
			.lean()
			.populate('detail.created_by', 'name lastName')
		if (req.query.page && req.query.size) {
			payload = await pagination(PartnerParent)(req.query)
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
		const result = await PartnerParent.findOne(req.params)
			.populate('created_by updated_by', 'name lastName')
			.select('-detail')
			.lean()
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Insert a new document into the collection
export const create = async (req, res) => {
	try {
		const created_by = req.user._id
		const request = req.body

		const validate = await saveValidation(PartnerParent)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		const partner = await Partner.findOne({ uuid: request.partnerUuid }).lean()
		const data = { ...request, partner: partner._id }

		const result = await PartnerParent.create(data)
		const { name, lastName, relationship } = result
		const options = [ 'Padre', 'Madre', 'Tutor' ]
		const detail = {
			cause: 'Actualización de familia',
			created_by,
			description: `${name} ${lastName} agregado(a) como ${options[relationship]}`
		}

		await Partner.findByIdAndUpdate(result.partner, {
			$push: { detail, family: result._id }
		})

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Validate POST and PUT request before sending those requests
export const validate = async (req, res) => {
	try {
		const request = req.body
		const validate = await saveValidation(PartnerParent)(request, request.uuid)
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

		const validate = await saveValidation(PartnerParent)(payload, query.uuid)
		if (!validate.isValid) return res.status(400).json(validate)

		detail = { ...detail, created_by: updated_by }
		const data = { ...payload, updated_by, $push: { detail } }
		const result = await PartnerParent.findOneAndUpdate(query, data, { new: true })

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
		const { detail } = req.body
		const query = { uuid: req.params.uuid }
		const { active } = await PartnerParent.findOne(query)

		const data = { active: !active, $push: { detail } }
		const result = await PartnerParent.findOneAndUpdate(query, data, { new: true })
		await Partner.findByIdAndUpdate(result.partner, {
			$push: { detail },
			$pull: { family: result._id }
		})

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
		const result = await PartnerParent.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Retrieve all documents filtered by one partner
export const getByPartner = async (req, res) => {
	try {
		const partner = await Partner.findOne({ uuid: req.params.partneruuid })
		const result = await PartnerParent.find({ partner: partner._id, active: true }).sort({ _id: -1 }).lean()

		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}
