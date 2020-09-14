import Home from './../Home'
import About from './../About'
import Login from './../Login/Login'
import Dashboard from './../Dashboard/Dashboard'
import FormExample from '../FormExample'

export const routes = [
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
    path: '/form',
    component: FormExample
  }
]
