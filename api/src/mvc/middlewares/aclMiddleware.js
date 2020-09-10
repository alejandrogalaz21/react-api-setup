import User from './../models/user'
import { isEmpty } from './../../util'

/**
 * ACL middleware to check if user has been granted with the required
 * permissions to use the endpoint chained next to this middleware
 * */
export default async function aclMiddleware(req, res, next) {
  try {
    const methods = { GET: 'read', POST: 'create', PUT: 'update', DELETE: 'delete' }
    const action = methods[req.method]
    const route = req.originalUrl

    // Search the user to get its permissions
    const user = await User.findOne({ _id: req.user._id, active: true })
      .populate({ path: 'permissions.permissions', populate: { path: 'module' } })
      .populate({ path: 'permissions.institution' })
      .lean()

    if (!user) throw { message: 'Usuario no encontrado' }
    if (user.role === 0) return next() // Super user has all access granted
    if (user.role === 2) throw { message: 'Acceso denegado' }

    // Check if the user has the permission on the module
    const permissions = getPermissions(user.permissions).filter(permission => {
      const regex = `^${permission.module.url.api}`
      // Match the base of route path, example: /api/user matchs /api/user/options
      const match = new RegExp(regex, 'i').test(route)
      const can = permission[action]
      return match && can
    })

    const hasPermission = !isEmpty(permissions)
    req.institutions = permissions.map(permission => permission.institution)

    // User has NO permission to use the chained endpoint
    if (!hasPermission) throw { message: 'Acceso denegado' }

    // User HAS permission, PROCEED
    return next()
  } catch (error) {
    return res.status(401).json(error)
  }
}

function getPermissions(permissions) {
  return permissions.reduce((result, item) => {
    result = [...result, ...item.permissions]
    return result
  }, [])
}
