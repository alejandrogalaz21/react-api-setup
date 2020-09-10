import React from 'react'
import { connect } from 'react-redux'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { routes } from './routes'

function Router({ user, props }) {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((route, index) => {
          // route not protected
          if (!route.hasOwnProperty('protected') || route.protected === false) {
            return <Route key={index} exact path={route.path} component={route.component} />
          }
          // route protected
          if (
            route.hasOwnProperty('protected') &&
            route.protected === true &&
            user.isAuthenticated
          ) {
            return <Route key={index} exact path={route.path} component={route.component} />
          }

          return <Redirect to='/' />
        })}
      </Switch>
    </BrowserRouter>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Router)
