import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
// enhancers
import monitorReducersEnhancer from './enhancers/monitorReducer'
// middleware
import loggerMiddleware from './middleware/logger'
// reducer's
import rootReducer from './reducers'
import createSagaMiddleware from 'redux-saga'
import { routerMiddleware } from 'connected-react-router'

import { initSagas } from './init.sagas'
import { createBrowserHistory } from 'history'

export const history = createBrowserHistory()
export default function configureStore(preloadedState) {
  let store = null
  // config saga middleware
  const sagaMiddleware = createSagaMiddleware()

  const middlewares = [loggerMiddleware, routerMiddleware(history), sagaMiddleware]
  const middlewareEnhancer = applyMiddleware(...middlewares)
  const enhancers = [middlewareEnhancer, monitorReducersEnhancer]

  // redux dev tools
  process.env.REACT_APP_ENV !== 'production'
    ? (store = createStore(rootReducer, preloadedState, composeWithDevTools(...enhancers)))
    : (store = createStore(rootReducer, preloadedState, enhancers))

  // redux hot reload
  if (process.env.REACT_APP_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  }
  // init sagas
  initSagas(sagaMiddleware)
  return store
}
