import express from 'express'
import * as userController from '../controllers/userController'

const router = express.Router()

// GET user by id
router.get('/:id', userController.user_detail);

// UPDATE user 
router.put('/:id', userController.user_update)

// GET user conversations
router.get('/:id/conversations', userController.user_conversations)

export { router }
