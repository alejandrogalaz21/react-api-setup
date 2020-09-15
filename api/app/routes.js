/* PLOP_INJECT_IMPORT */
import { products } from './products/products.controller.js'
import { produtcs } from './produtcs/produtcs.controller.js'
import { auth } from './auth/auth.controller'
import { users } from './users/users.controller'

export const apiRoutes = [/* PLOP_INJECT_EXPORT */
	products,
	produtcs, auth, users]
