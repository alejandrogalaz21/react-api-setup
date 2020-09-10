import * as notification from './../dal/notification'
import pagination from '../../util/pagination'

/**
 * @params  req, res
 * @desc    retrieve all notifications
 */
export const index = async (req, res) => {
  try {
    let payload = await notification.getAllNotifications()
    if (req.query.page && req.query.size) {
      payload = await pagination(notification.model)(req.query)
    }
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params  req, res
 * @desc    retrive a single notification based on its uuid
 */
export const show = async (req, res) => {
  try {
    const params = req.params
    const result = await notification.showNotification(params)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params  req, res
 * @desc    create a new notification record
 */
export const create = async (req, res) => {
  try {
    const request = req.body
    const payload = await notification.createNotification(request)
    return res.status(200).json(payload)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params  req, res
 * @desc    update on record
 */
export const update = async (req, res) => {
  try {
    const params = req.params
    const request = req.body
    const result = await notification.updateNotification(params, request)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params  req, res
 * @desc    toggle the active property of a record
 */
export const toggle = async (req, res) => {
  try {
    const params = req.params
    const result = await notification.toggleNotification(params)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params  req, res
 * @desc    remove a document for the collection
 */
export const destroy = async (req, res) => {
  try {
    const params = req.params
    const result = await notification.destroyNotification(params)
    return res.status(200).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
