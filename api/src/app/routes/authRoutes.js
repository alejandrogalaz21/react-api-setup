import * as auth from '../controllers/authController'
import { authenticated } from './../middlewares'
import { Router } from 'express'
const router = new Router()

/**
 * @access    Private
 * @route     POST api/auth/login
 * @desc      create the jwt for a user to login.
 * @params    Object.
 */
router.post('/auth/login', auth.login)

/**
 * @access    Private
 * @route     PUT api/auth/:id
 * @desc      set the "login" property to false of a user document.
 * @params    id, Object.
 */
router.put('/auth/logout/:id', authenticated, auth.logout)

// @access    Public
// @route     POST api/auth/request-recover-password
// @desc      Reset an user password
// @params    none.
router.post('/auth/request-recover-password', auth.requestRecoverPassword)

// @access    Public
// @route     POST api/auth/recover-password
// @desc      Reset an user password
// @params    none.
router.post('/auth/recover-password', auth.recoverPassword)

// @access    Public
// @route     POST api/auth/reset-password
// @desc      Reset an user password
// @params    none.
router.post('/auth/reset-password', authenticated, auth.resetPassword)

export default router
