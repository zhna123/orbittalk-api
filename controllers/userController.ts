import { UserModel } from "../models/user";
import expressAsyncHandler from "express-async-handler";

// Get user details by id
export const user_detail = expressAsyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get User detail: ${req.params.id}`);
})

// Update user details
export const user_update = expressAsyncHandler(async(req, res, next) => {
  res.send(`NOT IMPLEMENTED: Update User detail: ${req.params.id}`)
})

// Get a particular user's conversations
export const user_conversations = expressAsyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Get User conversations: ${req.params.id}`)
})