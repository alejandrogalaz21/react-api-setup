import { combineReducers } from 'redux'
// app reducer's
import { reducer as form } from 'redux-form'
import { createBrowserHistory } from 'history'
import { connectRouter } from 'connected-react-router'
// custom reducer's
/* PLOP_INJECT_IMPORT */
import { items } from './../../components/Item/item.redux'
import { products } from '../../modules/Product/product.redux'
import { app } from './app.reducer'
import { user } from './../../components/User/user.redux'

export const router = connectRouter(createBrowserHistory())

export default combineReducers({
  /* PLOP_INJECT_EXPORT */
	items,
  products,
  router,
  form,
  app,
  user
})
