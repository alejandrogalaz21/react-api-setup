/* PLOP_INJECT_IMPORT */
import { articles } from './articles/articles.controller.js'
import { products } from './products/products.controller.js'
import { auth } from './auth/auth.controller'
import { users } from './users/users.controller'

export const apiRoutes = [/* PLOP_INJECT_EXPORT */
	articles, products, auth, users]
