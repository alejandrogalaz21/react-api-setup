const dotenv = require('dotenv')
dotenv.config()

exports.ENV = process.env.NODE_ENV || 'development'
exports.SECRET = process.env.SECRET || 'a211221684app'
exports.PORT = process.env.PORT || 3005
exports.EXPIRES_IN = process.env.EXPIRES_IN || '1 days'
exports.MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost:27017/app'

exports.MYSQL = {
  host: process.env.MYSQL_HOST || 'dev_mysql',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'root'
}

exports.MAILER = {
  host: process.env.MAILER_HOST || 'smtp.office365.com',
  port: process.env.MAILER_PORT || 587,
  auth: {
    user: process.env.MAILER_USER || 'probono@softtek.com',
    pass: process.env.MAILER_PASS
  }
}
