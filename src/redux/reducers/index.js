import { combineReducers } from 'redux'
import { app } from './app.reducer'
import { user } from './../../components/User/user.redux'

export default combineReducers({
  app,
  user
})
