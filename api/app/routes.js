import { user } from './user/user.controller'
import { product } from './product/product.controller'
import { auth } from './auth/auth.controller'

export const apiRoutes = [user, auth, product]
