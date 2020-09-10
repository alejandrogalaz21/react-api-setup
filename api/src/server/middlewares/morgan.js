import { Router } from 'express'
import morgan from 'morgan'

const router = new Router()

const morganConfig = (tokens, req, res) =>
  [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms'
  ].join(' ')

router.use(morgan(morganConfig))

export default router
