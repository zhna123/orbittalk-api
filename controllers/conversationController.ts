import { ConversationModel } from "../models/conversation";
import expressAsyncHandler from "express-async-handler";
import { MessageModel } from "../models/message";

// Get a conversation by id
export const conversation_detail = expressAsyncHandler(async (req, res, next) => {
  const conversation = await ConversationModel.findOne({_id: req.params.id, userids: req.authenticatedUser!.userid}).exec()
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
    userids: [req.body.userid, req.authenticatedUser!.userid]
  })
  await conversation.save()
  res.status(201).json({msg: 'conversation created'})
})

// POST create a new message in a conversation
export const message_create = expressAsyncHandler(async (req, res, next) => {
  const conversation = await ConversationModel.findOne({_id: req.params.id, userids: req.authenticatedUser!.userid}).exec()
  if (conversation === null) {
    const err = new Error("conversation not found")
    return next(err)
  }
  const message = new MessageModel({
    content: req.body.content,
    sender: req.authenticatedUser!.userid,
  })
  conversation.messages.push(message)
  await conversation.save()
  res.status(201).json({msg: 'message created'})
})