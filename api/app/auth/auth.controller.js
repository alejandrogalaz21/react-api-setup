import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from './../user/user'
import { blue } from './../../helpers/chalk.helper'
import { createJWT, generatePassword } from './auth.helper'
import { EXPIRES_IN, SECRET, ENV } from '../../keys'
import { ErrorHandler } from '../../helpers/error.helper'

const router = new Router()

export function authController(Collection) {
  router.post('/login', login)
  router.put('/logout/:id', logout)
  router.post('/request-recover-password', requestRecoverPassword)
  router.post('/recover-password', recoverPassword)
  router.post('/reset-password', resetPassword)

  async function login(req, res, next) {
    try {
      blue('auths > controller > login')
      const { email, password } = req.body
      const user = await Collection.findOne({ email }).lean()

      if (!user) {
        throw new ErrorHandler({ status: 400, message: 'Acceso denegado' })
      } else if (user) {
        const correctCredentials = bcrypt.compareSync(password, user.password)
        if (!correctCredentials) {
          throw new ErrorHandler({ status: 400, message: 'Credenciales inválidas' })
        } else if (user.isActive !== true) {
          throw new ErrorHandler({ status: 400, message: 'Usuario inactivo' })
        }
      }
      const token = await createJWT(user, SECRET, EXPIRES_IN)
      return res.status(200).json(token)
    } catch (error) {
      next(error)
    }
  }

  async function logout(req, res, next) {
    try {
      const query = { _id: req.params.id }
      const user = await Collection.findOneAndUpdate(
        query,
        { login: false },
        { new: true }
      )
      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  async function requestRecoverPassword(req, res, next) {
    try {
      const { email } = req.body

      // Find the user with the associated email
      const doc = await Collection.findOne({ email })

      if (!doc) {
        throw new ErrorHandler({
          status: 400,
          message: 'Verifica con el administrador tu acceso',
          fields: { email: 'Usuario no válido' }
        })
      }

      // Generate a 20 characters' recover token
      const recoverPasswordToken = generatePassword(20)
      const recoverPasswordExpires = Date.now() + 3600000 // 1 hour to expire

      // Hash the token to store it in DB
      const salt = bcrypt.genSaltSync(10)
      const hashToken = bcrypt.hashSync(recoverPasswordToken, salt)

      // Add the hashed recovery token to the user document
      const user = await Collection.findOneAndUpdate(
        { email },
        { recoverPasswordToken: hashToken, recoverPasswordExpires }
      )

      // Structure the url to change its password
      const hostname = ENV === 'develop' ? 'localhost:3000' : req.headers.host
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
    } catch (error) {
      next(error)
    }
  }

  async function recoverPassword(req, res, next) {
    try {
      const { email, token, password } = req.body
      // Find the user with the given email and check if its token hasn't expired
      const user = await Collection.findOne({
        email,
        recoverPasswordExpires: { $gt: Date.now() }
      })

      // ? Does the recovery token match with the given?
      const isMatch = bcrypt.compareSync(token, user.recoverPasswordToken)

      //* Collection's recovery token is correct
      if (isMatch && token) {
        // Hash the new password to store in DB
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        // Update the password
        // Set the recovery password token and its expiring time to null
        const doc = await Collection.findByIdAndUpdate(user._id, {
          password: hash,
          recoverPasswordToken: null,
          recoverPasswordExpires: null
        })

        return res.status(200).json(doc)
      }
      // Collection not found or its recovery token is not correct
      throw new ErrorHandler({ status: 401, message: 'No autorizado' })
    } catch (error) {
      next(error)
    }
  }

  async function resetPassword(req, res, next) {
    try {
      const { password, newPassword } = req.body
      // Generate a random salt
      const salt = bcrypt.genSaltSync(10)
      // Find the user which request the reset
      const user = await Collection.findById(req.user._id)
      const isMatch = bcrypt.compareSync(password, user.password)

      //* Collection's password matches
      if (isMatch) {
        const hash = bcrypt.hashSync(newPassword, salt)
        // Change the password (hashed)
        const doc = await Collection.findByIdAndUpdate(req.user._id, {
          password: hash,
          changePassword: false
        })

        return res.status(200).json(doc)
      }
      // Collection password is not correct
      throw new ErrorHandler({ status: 400, message: 'Contraseña incorrecta' })
    } catch (error) {
      next(error)
    }
  }

  return router
}

export const auth = router.use('/auth', authController(User))
