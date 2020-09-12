import { combineReducers } from 'redux'
// app reducer's
import { reducer as form } from 'redux-form'
import { createBrowserHistory } from 'history'
import { connectRouter } from 'connected-react-router'
// custom reducer's
import { app } from './app.reducer'
import { user } from './../../components/User/user.redux'
import { users } from './../../components/User/users.redux'
import { products } from './../../components/Products/products.redux'

export const router = connectRouter(createBrowserHistory())

export default combineReducers({
  router,
  form,
  app,
  user,
  users,
  products
})
