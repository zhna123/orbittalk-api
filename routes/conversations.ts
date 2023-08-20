import express from 'express'
import * as conversationController from '../controllers/conversationController'
import * as userController from '../controllers/userController'
import { authenticateToken } from '../lib/authenticate'

const router = express.Router()

// GET conversation by id
router.get('/:id', authenticateToken, conversationController.conversation_detail)

// POST create a new conversation
router.post('/', authenticateToken, conversationController.conversation_create)

// PUT create a new message in a conversation
router.put('/:id/messages', authenticateToken, conversationController.message_create)

// PUT udpate all messages as read (read/unread)
router.put('/messages', authenticateToken, conversationController.message_update)

// GET user conversations
router.get('/', authenticateToken, userController.user_conversations)

export { router }