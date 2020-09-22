/* PLOP_INJECT_IMPORT */
import { products } from './products/products.controller.js'
import { auth } from './auth/auth.controller'
import { users } from './users/users.controller'
import { products } from './products/products.controller'
import { articles } from './articles/articles.controller'

export const apiRoutes = [/* PLOP_INJECT_EXPORT */ products, auth, users, articles]
