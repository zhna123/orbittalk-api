import express, { Request, Response} from 'express'
import * as conversationController from '../controllers/conversationController'
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

// GET conversation by id
router.get('/:id', authenticateToken, conversationController.conversation_detail)

// POST create a new conversation
router.post('/', authenticateToken, conversationController.conversation_create)

// POST create a new message in a conversation
router.post('/:id/messages', authenticateToken, conversationController.message_create)

export { router }