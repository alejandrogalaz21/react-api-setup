import User from './../models/user'
import { createJWT } from './../../util/authHelpers'
import config from './../../server/config/config'
import { validateLoginFields, validateUser } from './../validation/auth'
import bcrypt from 'bcryptjs'
import { generatePassword } from '../../util/authHelpers'
import { generateMailer } from './../services/mailer'

export const getProps = user => ({
  _id: user._id,
  uuid: user.uuid,
  name: user.name,
  lastName: user.lastName,
  institutions: user.institutions,
  email: user.email
})

/**
 * @params  req, res
 * @desc    Creates the JWT and send it as response,
 *          set as true the login property of the user doc
 */
export const login = async (req, res) => {
  try {
    const request = req.body

    // Login request validations
    const fields = validateLoginFields(request)
    if (!fields.isValid) return res.status(400).json(fields.errors)
    // Auth request validation
    const user = await validateUser(User)(request)
    if (!user.isValid) return res.status(400).json(user.errors)

    if (user.props.role === 2)
      return res.status(401).json({ message: 'No puede iniciar sesión' })

    // Create the JWT
    const props = getProps(user.props)
    const token = await createJWT(props, config.secret, config.expiresIn)

    return res.status(200).json(token)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

/**
 * @params  req, res
 * @desc    Set the "login" property to false for a user
 */
export const logout = async (req, res) => {
  try {
    const query = { _id: req.params.id }
    // Set the user's "login" property as false
    const user = await User.findOneAndUpdate(query, { login: false }, { new: true })
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// @params     req, res
// @desc       Request to recover forgotten password
export const requestRecoverPassword = async (req, res) => {
  try {
    const { email } = req.body

    // Find the user with the associated email
    const doc = await User.findOne({ email })
    const canRecoverPassword = doc === null || doc.role !== 2

    if (canRecoverPassword) {
      // Generate a 20 characters' recover token
      const recoverPasswordToken = generatePassword(20)
      const recoverPasswordExpires = Date.now() + 3600000 // 1 hour to expire

      // Hash the token to store it in DB
      const salt = bcrypt.genSaltSync(10)
      const hashToken = bcrypt.hashSync(recoverPasswordToken, salt)

      // Add the hashed recovery token to the user document
      const user = await User.findOneAndUpdate(
        { email },
        { recoverPasswordToken: hashToken, recoverPasswordExpires }
      )

      // Structure the url to change its password
      const hostname = config.env === 'develop' ? 'localhost:3000' : req.headers.host
      const pathname = 'recover-password'
      const queries = `email=${email}&token=${recoverPasswordToken}`
      const url = `http://${hostname}/${pathname}?${queries}`

      const mailer = await generateMailer()
      await mailer.send({
        template: 'recoverPassword',
        message: { to: user.email },
        locals: { url }
      })

      return res.status(200).json({ message: 'Se envió un link de recuperación' })
    } else {
      const description = 'Verifica con el administrador tu acceso al sistema'
      return res.status(400).json({ message: 'Usuario no válido', description })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// @params     req, res
// @desc       Changes a users password in order to the previous request
export const recoverPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body

    // Find the user with the given email and check if
    // its token hasn't expired
    const user = await User.findOne({
      email,
      recoverPasswordExpires: { $gt: Date.now() },
      role: { $in: [0, 1] }
    })

    // ? Does the recovery token match with the given?
    const isMatch = bcrypt.compareSync(token, user.recoverPasswordToken)

    //* User's recovery token is correct
    if (isMatch && token) {
      // Hash the new password to store in DB
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)

      // Update the password
      // Set the recovery password token and its expiring time to null
      const doc = await User.findByIdAndUpdate(user._id, {
        password: hash,
        recoverPasswordToken: null,
        recoverPasswordExpires: null
      })

      return res.status(200).json(doc)
    }
    // User not found or its recovery token is not correct
    return res.status(401).json({ message: 'No autorizado' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}

// @params     req, res
// @desc       Changes a users password
export const resetPassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body

    // Generate a random salt
    const salt = bcrypt.genSaltSync(10)
    // Find the user which request the reset
    const user = await User.findOne({
      _id: req.user._id, role: { $in: [0, 1] }
    })
    const isMatch = bcrypt.compareSync(password, user.password)

    //* User's password matches
    if (isMatch) {
      const hash = bcrypt.hashSync(newPassword, salt)

      // Change the password (hashed)
      const doc = await User.findByIdAndUpdate(req.user._id, {
        password: hash,
        changePassword: false
      })

      return res.status(200).json(doc)
    }
    // User password is not correct
    return res.status(400).json({ message: 'Contraseña provisional incorrecta' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
