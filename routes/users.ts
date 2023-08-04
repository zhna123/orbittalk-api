import express, { Request, Response } from 'express'
import * as userController from '../controllers/userController'
import { BlacklistModel } from '../models/token_blacklist';
import * as jwtHelper from '../lib/jwt'

const router = express.Router()

async function authenticateToken(req: Request, res: Response, next: any) {
  const jwtToken = req.cookies.jwt;
  if (jwtToken === null) {
    return res.sendStatus(401)
  }
  // check if token is blacklisted
  const result = await BlacklistModel.findOne({ token: jwtToken, type: 'ACCESS'}).exec()
  if (result !== null) {
    return res.sendStatus(403)
  }
  const user = jwtHelper.verifyJWT(jwtToken, process.env.ACCESS_TOKEN_SECRET!);
  if (user === null) {
    return res.status(403).json({error: 'JWT verification failed.'})
  }
  req.authenticatedUser = user;
  next()
}

// GET user by id
router.get('/', authenticateToken, userController.user_detail);

// UPDATE user password
router.put('/password', authenticateToken, userController.user_password)

// UPDATE user avatar
router.put('/avatar', authenticateToken, userController.user_avatar)

// GET user conversations
router.get('/conversations', authenticateToken, userController.user_conversations)

export { router }
