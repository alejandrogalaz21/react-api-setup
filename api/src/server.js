import http from 'http'
import chalk from 'chalk'
import { app, reportingApp } from './server/app'
import config from './server/config/config'
import socketIo from 'socket.io'
import socketApp from './sockets'
import jsreport from 'jsreport'
import { jsReportConfig } from './jsreport.config.js'

const server = http.Server(app)
const io = socketIo(server)

io.set('origins', '*:*')

// load the express and server instances
const jsrConfig = jsReportConfig(reportingApp, server)
const jsr = jsreport(jsrConfig)

server.listen(config.port, () => {
  socketApp(io)

  jsr
    .init()
    .then(() => {
      console.log('jsreport server started')
    })
    .catch(e => {
      console.error(e)
    })

  console.log(chalk.green('server started :'))
  console.log(chalk.blue(`http://localhost:${config.port}`))
  console.log(chalk.magenta(`ws://localhost:${config.port}`))
  console.log(chalk.yellow(`http://localhost:${config.port}/api`))
  console.log(chalk.magenta(`http://localhost:${config.port}${config.graphqlUrl}`))
})

export { io, jsr }
export default server
