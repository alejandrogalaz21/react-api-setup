import React from 'react'
import { Provider } from 'react-redux'
import configureStore from './redux/configureStore'
import Router from './router'

const store = configureStore()

console.log(process.env.REACT_APP_ENV)
if (process.env.REACT_APP_ENV !== 'production') {
  window.store = configureStore()
}

function App() {
  return (
    <Provider store={store}>
      <Router />
    </Provider>
  )
}

export default App
