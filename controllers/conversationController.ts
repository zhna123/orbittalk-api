import { Conversation, ConversationModel } from "../models/conversation";
import expressAsyncHandler from "express-async-handler";
import { MessageModel } from "../models/message";
import { findOneConversation, saveConversation, updateConversation } from "../db/dbOps";

// Get a conversation by id
export const conversation_detail = expressAsyncHandler(async (req, res, next) => {
  const conversation = await findOneConversation(req.params.id, req.authenticatedUser!.userid)

  if (conversation === null) {
    const err = new Error("conversation not found")
    return next(err)
  }
  res.status(200).json(conversation)
})

// POST create a new conversation
export const conversation_create = expressAsyncHandler(async (req, res, next) => {
  const conversation = new ConversationModel({
    messages: req.body.messages,
    userids: req.body.userids
  })
  await saveConversation(conversation)
  res.status(201).json({msg: 'conversation created', data: conversation})
})

// PUT create a new message in a conversation
export const message_create = expressAsyncHandler(async (req, res, next) => {
  const conversation = await findOneConversation(req.params.id, req.authenticatedUser!.userid);
  if (conversation === null) {
    const err = new Error("conversation not found")
    return next(err)
  }
  const message = new MessageModel({
    content: req.body.content,
    date_time: req.body.date_time,
    sender: req.authenticatedUser!.userid,
  })
  conversation.messages.push(message)
  await saveConversation(conversation)
  res.status(201).json({msg: 'message created', data: message})
})

// PUT update a message by id
export const message_update = expressAsyncHandler(async (req, res, next) => {

  const conversation: Conversation = req.body;

  const messages = conversation.messages;
  const updatedMessages = messages.map(m => ({...m, "is_read": true}))

  await updateConversation(conversation._id.toString(), {messages: updatedMessages})
  res.status(200).json({msg: 'message updated'})
})