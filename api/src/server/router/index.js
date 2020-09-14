import { Router } from 'express'
import apiRoutes from './apiRoutes'

const router = new Router()

router.use('/api', apiRoutes)

export default router
