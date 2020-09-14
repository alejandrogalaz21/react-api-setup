import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import User from './../../../mvc/models/user'
import { Router } from 'express'
import config from './../config'
const router = new Router()

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret
}

export const jwtStrategy = new Strategy(options, (payload, done) => {
  User.findById(payload._id)
    .then(user => {
      if (!user) return done(null, false)
      return done(null, payload)
    })
    .catch(error => console.log(error))
})

passport.use(jwtStrategy)
const authInitialize = passport.initialize()
export default router.use(authInitialize)
