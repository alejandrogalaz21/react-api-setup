/* PLOP_INJECT_IMPORT */
import { auth } from './auth/auth.controller'
import { users } from './users/users.controller'
import { articles } from './articles/articles.controller'

export const apiRoutes = [/* PLOP_INJECT_EXPORT */ auth, users]
