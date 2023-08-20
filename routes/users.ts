import express from 'express'
import * as userController from '../controllers/userController'
import { authenticateToken } from '../lib/authenticate'

const router = express.Router()

// GET authenticated user
router.get('/', authenticateToken, userController.auth_user_detail);

// GET user by id (TODO: must be user's friends)
router.get('/:id', authenticateToken, userController.user_detail);

// GET user by username (user look up - add friend)
router.get('/username/:username', authenticateToken, userController.user_detail_by_name);

// UPDATE user password
router.put('/password', authenticateToken, userController.user_password)

// UPDATE user avatar
router.put('/avatar', authenticateToken, userController.user_avatar)

// UPDATE add a friend
router.put('/friend', authenticateToken, userController.add_friend)

// UPDATE user online status
router.put('/status', authenticateToken, userController.updateStatus)


export { router }
