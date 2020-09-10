import Modules from './../models/modules'
import { saveValidation } from './../validation/modules'
import pagination from './../../util/pagination'

// Retrieve all documents in the collection
export const index = async (req, res) => {
  try {
    let payload = await Modules.find()
      .sort({ updatedAt: -1 })
      .select('uuid name label url active createdAt detail')
      .lean()
    if (req.query.page && req.query.size) {
      payload = await pagination(Modules)(req.query)
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
    const result = await Modules.findOne(req.params)
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
    const request = req.body
    const validate = await saveValidation(Modules)(request)
    if (!validate.isValid) return res.status(400).json(validate)

    const detail = { cause: 'Creación', description: 'Nuevo módulo agregado' }
    const data = { ...request, detail: [detail] }
    const payload = await Modules.create(data)

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
    const validate = await saveValidation(Modules)(request, request.uuid)
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
    const validate = await saveValidation(Modules)(payload, query.uuid)
    if (!validate.isValid) return res.status(400).json(validate)
    const data = { ...payload, $push: { detail } }
    const result = await Modules.findOneAndUpdate(query, data, { new: true })
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
    const { active } = await Modules.findOne(query)
    const data = { active: !active, $push: { detail: req.body.detail } }
    const result = await Modules.findOneAndUpdate(query, data, { new: true })
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
    const result = await Modules.findOneAndDelete(query)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
