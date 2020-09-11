import Home from './../Home'
import About from './../About'
import Login from './../Login/Login'
import Dashboard from './../Dashboard/Dashboard'
import Users from './../User/Users.js'

export const routes = [
  {
    path: '/',
    component: Users
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
  }
]
