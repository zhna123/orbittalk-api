import { UserModel } from "../models/user";
import expressAsyncHandler from "express-async-handler";
import { Result, ValidationError, body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import { findUserById, findUserByIdAndUpdate, findUserByName, findUserConversations } from "../db/dbOps";
import multer from 'multer'
import fs from 'fs'
import { Request, Response } from 'express'


// 300KB
const MAX_FILE_SIZE = 300000

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images/')
  },
})
const upload_ = multer({ storage: storage, limits: {fileSize: MAX_FILE_SIZE}})

// Get authenticated user detail
export const auth_user_detail = expressAsyncHandler(async (req, res, next) => {
  try {
    const user = await findUserById(req.authenticatedUser!.userid);
    
    if (user === null) {
      const err = new Error("user not found")
      return next(err)
    }
    res.status(200).json(user)
  } catch (err) {
    console.log('error when retrieving authenticated user:' + err)
  }
})

// Get user details by id
export const user_detail = expressAsyncHandler(async (req, res, next) => {
  const user = await findUserById(req.params.id);

  if (user === null) {
    const err = new Error("user not found")
    return next(err)
  }
  res.status(200).json(user)
})

// Get user details by username
export const user_detail_by_name = expressAsyncHandler(async (req, res, next) => {
  const user = await findUserByName(req.params.username);

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
      res.status(400).json([...errors.array()])
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

export const user_avatar = [
  
  uploadFile,

  expressAsyncHandler(async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return
      }
      const avatarFile = req.file

      const avatarPath = avatarFile!.path
  
      const userId = req.authenticatedUser!.userid
      const user = await findUserById(userId)
      
      user!.avatar = fs.readFileSync(avatarPath)
  
      await user!.save()

      // delete the file
      fs.unlinkSync(avatarPath)
      
      res.status(200).json({msg: 'user avatar updated', data: user!.avatar})
    } catch (err) {
      console.log("error when uploading file:" + err)
    }
    
  })
]
// multer middleware that handles error
function uploadFile(req: Request, res: Response, next: any) {
  const upload = upload_.single('avatar');

  upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.log("muter error.." + err)
          return 
      } else if (err) {
          // An unknown error occurred when uploading.
          console.log("unknown error..." + err)
          return 
      }
      // Everything went fine. 
      next()
  })
}

export const add_friend = expressAsyncHandler(async (req, res, next) => {
  const friendId: string = req.body.friendId
  // add friend to user's friend list
  const userId = req.authenticatedUser!.userid
  const user = await findUserById(userId)
  user!.friends.addToSet(friendId)
  await user!.save()

  // add user to friend's friend list
  const friend = await findUserById(friendId)
  friend!.friends.addToSet(userId)
  await friend!.save()
  res.status(200).json({msg: 'friend added', data: friend})
})

export const updateStatus = expressAsyncHandler(async (req, res, next) => {
  const { isOnline } = req.query;

  const userId = req.authenticatedUser!.userid
  const user = await findUserById(userId)

  if (isOnline === 'true') {
    user!.is_online = true
  } else {
    user!.is_online = false
  }
  await user!.save();
  res.status(200).json({msg:'status updated'})
})

// Get a particular user's conversations
export const user_conversations = expressAsyncHandler(async (req, res, next) => {
  const conversations = await findUserConversations(req.authenticatedUser!.userid);
  res.status(200).json(conversations)
})

