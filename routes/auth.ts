import express from 'express'
import * as authController from '../controllers/authController'

const router = express.Router()

// generate new access token
router.post('/token', authController.new_token)

// POST user log in
router.post('/login', authController.log_in)

// DELETE user log out
router.delete('/logout', authController.log_out)

export { router }
