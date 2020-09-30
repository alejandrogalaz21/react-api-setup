const jsreport = require('jsreport')({
  httpPort: process.env.PORT,
  extensions: {
    'chrome-pdf': {
      launchOptions: {
        args: ['--no-sandbox']
      }
    },
    authentication: {
      cookieSession: {
        secret: process.env.SECRET
      },
      admin: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      }
    }
  }
})

if (process.env.JSREPORT_CLI) {
  // export jsreport instance to make it possible to use jsreport-cli
  module.exports = jsreport
} else {
  jsreport
    .init()
    .then(() => {
      // running
    })
    .catch(e => {
      // error during startup
      console.error(e.stack)
      process.exit(1)
    })
}
