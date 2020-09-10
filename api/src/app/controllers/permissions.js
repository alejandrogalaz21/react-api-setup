import Permissions from './../models/permissions'

export const index = async (req, res) => {
  try {
    const query = req.query
    const payload = await Permissions.find(query).sort({ updatedAt: -1 })
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const show = async (req, res) => {
  try {
    const query = { uuid: req.params.uuid }
    const payload = await Permissions.findOne(query)
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const create = async (req, res) => {
  try {
    const request = req.body
    const payload = await Permissions.create(request)
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const update = async (req, res) => {
  try {
    // const updated_by = req.permissions.uuid
    const query = { uuid: req.params.uuid }
    const payload = req.body

    // TODO: Store the detail
    const doc = await Permissions.findOneAndUpdate(query, { ...payload }, { new: true })

    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const toggle = async (req, res) => {
  try {
    // const updated_by = req.permissions.uuid
    const query = { uuid: req.params.uuid }
    const { active } = await Permissions.findOneAndUpdate(req.params)

    // TODO: store change's detail
    const doc = await Permissions.findOneAndUpdate(
      query,
      { active: !active },
      { new: true }
    )

    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const destroy = async (req, res) => {
  try {
    const query = { uuid: req.params.uuid }
    const doc = await Permissions.findOneAndRemove(query).exec()
    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

export const count = async (req, res) => {
  try {
    const doc = await Permissions.countDocuments({}).exec()
    return res.status(200).json(doc)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
