import express from 'express'
import * as conversationController from '../controllers/conversationController'

const router = express.Router()

// GET conversation by id
router.get('/:id', conversationController.conversation_detail)

// GET messages from a conversation
router.get('/:id/messages', conversationController.messages)

// POST create a new conversation
router.post('/', conversationController.conversation_create)

// POST create a new message in a conversation
router.post('/:id/messages', conversationController.message_create)

export { router }