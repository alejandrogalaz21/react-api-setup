import path from 'path'
import '@babel/polyfill'
import express from 'express'
//import mongoose from 'mongoose'
import router from './../server/router'
import mdbc from './datasources/mongodb'
import cors from './config/middleware/cors'
import middleware from './config/middleware'
import config from './../server/config/config'

// Create express instance
const app = express()
const reportingApp = express()

app.use('/reporting', reportingApp)

//Data Sources Instances
mdbc()

// makes /foo and /Foo the same
app.set('case sensitive routing', false)
// makes /foo and /foo/ the same
app.set('strict routing', false)
// # of spaces to indent prettified json
app.set('json spaces', 2)
// setup all the config middleware
app.use(middleware)
// cors middleware
app.use(cors)
// api routes
router.use('/api', apiRoutes)

app.get('/*', (req, res, next) => res.sendFile(path.join(config.publicPath, 'index.html')))

export { app, reportingApp }
