import User from './../models/user'

// Users of role 0 can view anything, users with role 1 can only view the information of its institution.
export const filterMiddleware = field => async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean()
    const queries = { ...req.params, ...req.query }
    const institutions = req.institutions ? req.institutions : user.institutions
    if (user.role !== 0) queries[field] = { $in: institutions }
    req.filterQuery = queries
    return next()
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}

const institutionMiddleware = filterMiddleware('institution')
export default institutionMiddleware
