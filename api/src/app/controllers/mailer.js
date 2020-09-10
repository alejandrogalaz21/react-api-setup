import Mailer from './../models/mailer'
import { saveValidation } from './../validation/mailer'
import pagination from './../../util/pagination'
import { encryptionAES, decryptionAES } from './../../util/encryption'
import { isEmpty } from './../../util'
import config from './../../server/config/config'

// Retrieve all documents in the collection
export const index = async (req, res) => {
	try {
		let payload = await Mailer.find().sort({ _id: -1 }).lean()
		if (req.query.page && req.query.size) {
			payload = await pagination(Mailer)(req.query)
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
		let response = {}
		let mailer = await Mailer.findOne({ uuid: req.params.uuid }).select('email transport uuid active').lean()

		if (!isEmpty(mailer)) {
			response = { ...mailer }
			response.transport.auth = {
				user: decryptionAES(mailer.transport.auth.user, config.secret),
				pass: decryptionAES(mailer.transport.auth.pass, config.secret)
			}
		}

		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Insert a new document into the collection
export const create = async (req, res) => {
	try {
		const request = req.body
		const validate = await saveValidation(Mailer)(request)
		if (!validate.isValid) return res.status(400).json(validate)

		await Mailer.updateMany({}, { active: false })

		const auth = {
			user: encryptionAES(request.transport.auth.user, config.secret),
			pass: encryptionAES(request.transport.auth.pass, config.secret)
		}
		const transport = { ...request.transport, auth }
		const response = await Mailer.create({ ...request, transport })

		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Validate POST and PUT request before sending those requests
export const validate = async (req, res) => {
	try {
		const request = req.body
		const validate = await saveValidation(Mailer)(request, request.uuid)
		return res.status(200).json(validate)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Update a document
export const update = async (req, res) => {
	try {
		const { payload, detail } = req.body
		const auth = {
			user: encryptionAES(payload.transport.auth.user, config.secret),
			pass: encryptionAES(payload.transport.auth.pass, config.secret)
		}

		const transport = { ...payload.transport, auth }

		const doc = await Mailer.findOneAndUpdate(
			{ active: true },
			{ ...payload, transport, $push: { detail } },
			{ new: true, upsert: true }
		).select('email transport uuid active -_id')

		return res.status(200).json(doc)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Logical deletion based on the active property
export const toggle = async (req, res) => {
	try {
		const query = { uuid: req.params.uuid }
		const { active } = await Mailer.findOne(query)
		if (active === false) {
			await Mailer.updateMany({}, { active: false })
		}
		const data = { active: !active, $push: { detail: req.body.detail } }
		const result = await Mailer.findOneAndUpdate(query, data, { new: true })

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
		const result = await Mailer.findOneAndDelete(query)
		return res.status(200).json(result)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}

// Retrieve a single document in the collection
export const getActive = async (req, res) => {
	try {
		let response = {}
		let mailer = await Mailer.findOne({ active: true }).select('email transport').lean()

		if (!isEmpty(mailer)) {
			response = { ...mailer }
			response.transport.auth = {
				user: decryptionAES(mailer.transport.auth.user, config.secret),
				pass: decryptionAES(mailer.transport.auth.pass, config.secret)
			}
		}

		return res.status(200).json(response)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error })
	}
}
