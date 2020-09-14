import config from './../config'
import { Router } from 'express'
import morgan from 'mongoose-morgan'

const router = new Router()
const dbURL = config.mongodbURL
router.use(morgan({ connectionString: dbURL }))

export default router
