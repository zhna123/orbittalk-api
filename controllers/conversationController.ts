import { ConversationModel } from "../models/conversation";
import expressAsyncHandler from "express-async-handler";

// Get a conversation by id
export const conversation_detail = expressAsyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get conversation detail: ${req.params.id}`)
})

// Get messages from a conversation
export const messages = expressAsyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get messages from a conversation: ${req.params.id}`)
})

// POST create a new conversation
export const conversation_create = expressAsyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: POST a new conversation`)
})

// POST create a new message in a conversation
export const message_create = expressAsyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Create a new messages in a conversation: ${req.params.id}`)
})