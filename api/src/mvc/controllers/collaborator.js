import Collaborator from './../models/collaborator'
import { collaboratorSaveValidation } from './../validation/collaborator'
import pagination from './../../util/pagination'

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await Collaborator.find()
      .sort({ updatedAt: -1 })
      .select('-fullName')
      .populate('position', 'name')
      .populate('thumbnail', 'path')
      .lean()
    if (req.query.page && req.query.size) {
      payload = await pagination(Collaborator)(req.query)
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
    const result = await Collaborator.findOne(req.params)
      .select('-detail -fullName')
      .populate('position', 'name')
      .populate('thumbnail', 'path')
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
    const request = req.body
    const validate = await collaboratorSaveValidation(Collaborator)(request)
    if (!validate.isValid) return res.status(400).json(validate)
    const payload = await Collaborator.create(request)
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
    const validate = await collaboratorSaveValidation(Collaborator)(
      request,
      request.uuid
    )
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
    const query = { uuid: req.params.uuid }
    const validate = await collaboratorSaveValidation(Collaborator)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)
    const data = { ...payload, $push: { detail } }
    const result = await Collaborator.findOneAndUpdate(query, data, { new: true })
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
    const { active } = await Collaborator.findOne(query)
    const data = { active: !active, $push: { detail: req.body.detail } }
    const result = await Collaborator.findOneAndUpdate(query, data, { new: true })
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
    const result = await Collaborator.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
