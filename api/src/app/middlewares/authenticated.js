import passport from 'passport'
const authenticated = passport.authenticate('jwt', { session: false })
export default authenticated
