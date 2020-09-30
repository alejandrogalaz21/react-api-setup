/* PLOP_INJECT_IMPORT */
import Home from './../components/Home'
import About from './../components/About'
import Login from './../components/Login/Login'
import Dashboard from './../components/Dashboard/Dashboard'
import Users from './../components/User/Users'
import FormExample from './../components/FormExample'

export const routes = [
  /* PLOP_INJECT_EXPORT */
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/home', component: Home },
  { path: '/about', component: About },
  { path: '/users', component: Users },
  { path: '/form', component: FormExample }
]
