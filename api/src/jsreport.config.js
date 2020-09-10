const jsReportConfig = (app, server) => ({
  appPath: '/reporting',
  store: { provider: 'fs' },
  httpPort: 3001,
  allowLocalFilesAccess: true,
  blobStorage: { provider: 'fs' },
  reportTimeout: 60000,
  logger: {
    console: {
      transport: 'console',
      level: 'debug'
    },
    file: {
      transport: 'file',
      level: 'info',
      filename: 'logs/reporter.log'
    },
    error: {
      transport: 'file',
      level: 'error',
      filename: 'logs/error.log'
    }
  },
  templatingEngines: {
    numberOfWorkers: 2,
    strategy: 'http-server'
  },
  extensions: {
    'chrome-pdf': {
      launchOptions: {
        args: ['--no-sandbox'] // Dockver env, can't open chrome
      }
    },
    authentication: {
      cookieSession: {
        secret: 'dasd321as56d1sd5s61vdv32'
      },
      admin: {
        username: 'admin',
        password: 'password'
      }
    },
    express: { app, server }
  }
})

module.exports = { jsReportConfig }
