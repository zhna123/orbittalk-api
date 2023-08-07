import express from 'express'
import * as userController from '../controllers/userController'
import { authenticateToken } from '../lib/authenticate'

const router = express.Router()

// GET user by id
router.get('/', authenticateToken, userController.user_detail);

// UPDATE user password
router.put('/password', authenticateToken, userController.user_password)

// UPDATE user avatar
router.put('/avatar', authenticateToken, userController.user_avatar)

// GET user conversations
router.get('/conversations', authenticateToken, userController.user_conversations)


export { router }
