/* PLOP_INJECT_IMPORT */
import Products from './../Product/Products'
import Product from './../Product/Product'
import ProductUpdate from './../Product/ProductUpdate'

import Home from './../Home'
import About from './../About'
import Login from './../Login/Login'
import Dashboard from './../Dashboard/Dashboard'
import Users from './../User/Users'
import FormExample from '../FormExample'

export const routes = [
  /* PLOP_INJECT_EXPORT */
  { path: '/products', component: Products },
  { path: '/products/:id', component: Product },
  { path: '/products/update/:id', component: ProductUpdate },
  {
    path: '/',
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/about',
    component: About
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/form',
    component: FormExample
  }
]
