/* PLOP_INJECT_IMPORT */
import { items } from './items/items.controller.js'
import { auth } from './auth/auth.controller'
import { users } from './users/users.controller'

export const apiRoutes = [/* PLOP_INJECT_EXPORT */ items, auth, users]
