import express from 'express'
import * as conversationController from '../controllers/conversationController'
import { authenticateToken } from '../lib/authenticate'

const router = express.Router()

// GET conversation by id
router.get('/:id', authenticateToken, conversationController.conversation_detail)

// POST create a new conversation
router.post('/', authenticateToken, conversationController.conversation_create)

// POST create a new message in a conversation
router.put('/:id/messages', authenticateToken, conversationController.message_create)

export { router }