import '@babel/polyfill'
import http from 'http'
import chalk from 'chalk'
import express from 'express'
import compression from 'compression'

// middlewares
import morgan from './server/middleware/morgan'
import helmet from './server/middleware/helmet'
import bodyParser from './server/middleware/bodyParser'
import passportJwt from './server/middleware/jwtMiddleware'
import cors from './server/middleware/cors'
import fileUpload from 'express-fileupload'

import { PORT, MONGO_DB } from './keys'
import { apiRoutes } from './app/routes'
import { mongooseConnection } from './server/db/mongoose.connection'
import { errorHandler } from './helpers/error.helper'
import { red } from './helpers/chalk.helper'
// import { handleError, errorHandler } from './helpers/error.helper'

// Create express instance's
const app = express()
const api = http.Server(app)
const files = fileUpload()

app.set('case sensitive routing', false) // makes /foo and /Foo the same
app.set('strict routing', false) // makes /foo and /foo/ the same
app.set('json spaces', 2) // # of spaces to indent prettified json

// setup all the config middleware
app.use(compression())
app.use(morgan)
app.use(helmet)
app.use(bodyParser)
app.use(passportJwt)
app.use(cors)
app.use(files)

// set app route's
app.use('/api', apiRoutes)

function errorCentralHandler(err, req, res, next) {
  red(err)
  const error = errorHandler(err)
  return res.status(error.status).send(error)
}

app.use(errorCentralHandler)

api.listen(PORT, () => {
  //Data Sources Instances
  mongooseConnection(MONGO_DB)
  console.log(chalk.green('server started :'))
  console.log(chalk.blue(`http://localhost:${PORT}`))
  console.log(chalk.yellow(`http://localhost:${PORT}/api`))
  console.log(chalk.yellow(`Data Base URL : ${MONGO_DB}`))
})
