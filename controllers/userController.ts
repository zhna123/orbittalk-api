import { ConversationModel } from "../models/conversation";
import { UserModel } from "../models/user";
import expressAsyncHandler from "express-async-handler";
import { Result, ValidationError, body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import { findUserById, findUserByIdAndUpdate, findUserConversations } from "../db/dbOps";


// Get user details by id
export const user_detail = expressAsyncHandler(async (req, res, next) => {
  const user = await findUserById(req.authenticatedUser!.userid);

  if (user === null) {
    const err = new Error("user not found")
    return next(err)
  }
  res.status(200).json(user)
})

// Update user password
export const user_password = [

  body('oldPassword')
  .custom(async (value: string, {req}) => {
    const user = await findUserById(req.authenticatedUser!.userid)
    const result = await bcrypt.compare(value, user!.password)
    if (result) {
      return Promise.resolve(true)
    }
    return Promise.reject("old password is wrong")
  }),

  body('password')
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage('password is required')
  .custom((value, {req}) => {
    if(value !== req.body.oldPassword) return true 
    return false
  })
  .withMessage('password is the same as the previous one'),

  body('passwordConfirmation')
  .custom((value, {req}) => {
    return value === req.body.password
  })
  .withMessage('password does not match'),

  expressAsyncHandler (async(req, res, next) => {
    const errors: Result<ValidationError> = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({...errors.array()})
    } else {
      const user = new UserModel({
        _id: req.authenticatedUser!.userid
      })
      bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
        if (err) {
          return next(err)
        } else {
          user.password = hashedPassword;
          const theUser = await findUserByIdAndUpdate(req.authenticatedUser!.userid, user);
          res.status(200).json(theUser)
        }
      })
    }
  })
]

export const user_avatar = []

// Get a particular user's conversations
export const user_conversations = expressAsyncHandler(async (req, res, next) => {
  const conversations = await findUserConversations(req.authenticatedUser!.userid);
  res.status(200).json(conversations)
})