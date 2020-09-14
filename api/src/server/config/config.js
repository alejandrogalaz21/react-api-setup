import appRoot from 'app-root-path'
import dotenv from 'dotenv'

dotenv.config()

// oly for develop
// Url
const graphqlUrl = process.env.GRAPHQL_URL || `/graphql`
const mongodbURL = process.env.DATABASE_URL || `mongodb://localhost:27017/club`
// Path's
const uploadsPath = process.env.UPLOADS_PATH || `${appRoot}/public/uploads`
const publicPath = process.env.PUBLIC_PATH || `${appRoot}/public`
// Server Port
const port = process.env.PORT || 3001
// Auth secret hash
const secret = process.env.SECRET || 'a211221684'
const expiresIn = process.env.EXPIRES_IN || '3 days'

export default {
  uploadsPath,
  publicPath,
  graphqlUrl,
  mongodbURL,
  expiresIn,
  secret,
  port
}
