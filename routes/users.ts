import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import * as userController from '../controllers/userController'

const router = express.Router()

function authenticateToken(req: Request, res: Response, next: any) {
  const token = req.cookies.jwt;
  if (token === null) {
    return res.sendStatus(401)
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({error: err})
    }
    req.user = user
    next()
  })
}

// GET user by id
router.get('/:id', userController.user_detail);

// UPDATE user 
router.put('/:id', userController.user_update)

// GET user conversations
router.get('/:id/conversations', userController.user_conversations)

export { router }
