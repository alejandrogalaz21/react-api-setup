import { auth } from './auth/auth.controller'
import { users } from './users/users.controller'
import { products } from './products/products.controller'

export const apiRoutes = [auth, users, products]
