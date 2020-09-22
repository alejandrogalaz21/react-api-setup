/* PLOP_INJECT_IMPORT */
import { Item, Items, ItemUpdate } from './../modules/Item'
import { Product, Products, ProductUpdate } from './../modules/Product'

import Home from './../components/Home'
import About from './../components/About'
import Login from './../components/Login/Login'
import Dashboard from './../components/Dashboard/Dashboard'
import Users from './../components/User/Users'
import FormExample from './../components/FormExample'

export const routes = [
  /* PLOP_INJECT_EXPORT */
	{ path: '/items', component: Items },	{ path: '/items/:id', component: Item },	{ path: '/items/update/:id', component: ItemUpdate },
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
