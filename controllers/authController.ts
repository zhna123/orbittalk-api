import {Request, Response} from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from "express-async-handler";
import { BlacklistModel } from "../models/token_blacklist";
import { User, UserModel } from '../models/user'
import * as jwtHelper from '../lib/jwt'
import { body, validationResult } from 'express-validator';


passport.use(
  new Strategy (async(username, password, done) => {
    try {
      const user = await UserModel.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password"})
        }
      })
    } catch(err) {
      return done(err);
    };
  })
);


export const new_token = expressAsyncHandler(async (req, res, next) => {
  const { jwtRefresh } = req.cookies;

  if (jwtRefresh === null) {
    res.sendStatus(401)
    return
  }
  // check if refreshToken is valid
  const result = await BlacklistModel.findOne({ token: jwtRefresh, type: 'REFRESH'}).exec()
  if (result !== null) {
    res.sendStatus(403)
    return 
  }
  // verify refresh token and generate access token
  try {
    const user = jwtHelper.verifyJWT(jwtRefresh, process.env.REFRESH_TOKEN_SECRET!);
    if (user === null) {
      res.status(403).json({error: 'JWT verification failed.'})
      return
    }
    const token = jwtHelper.generateAccessToken(user.username, user.userid)
    const expirationDate = jwtHelper.getExpirationDate()
    // update jwt token in cookie
    res.cookie('jwt', token, { 
      httpOnly: true,
      secure: true,
      // sameSite: 'none',
    });
    res.cookie('jwtExpiration', expirationDate.toUTCString());
    res.status(201).json({ success: true });
  } catch (err) {
    res.sendStatus(403)
  }
})

export const log_in = [
  body('username')
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage('username is required'),

  body('password')
  .trim()
  .isLength({min: 1})
  .escape()
  .withMessage('password is required'),

  (req: Request, res: Response, next: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json([...errors.array()])
      return
    }
    passport.authenticate('local', {session: false}, (err: any, user: any, info: any, status: any) => {
      
      if (err) { return next(err) }
      if (!user) { 
        return res.sendStatus(401)
      }
      // log in user
      req.login(user, {session: false}, async err => {
        if (err) { return next(err) }
        // generate access token and expiration date
        const userObj = user.toJSON()
        const token = jwtHelper.generateAccessToken(userObj.username, userObj._id)
        const expirationDate = jwtHelper.getExpirationDate()

        // Set the token as an HTTP-only cookie
        res.cookie('jwt', token, { 
          httpOnly: true,
          secure: true,
          // sameSite: 'none',
        });

        // Set the expiration time in another cookie
        res.cookie('jwtExpiration', expirationDate.toUTCString());

        // generate refresh token
        const refreshToken = jwtHelper.generateRefreshToken(userObj)
        // refreshTokens.push(refreshToken)

        // set refresh token as http-only cookie
        res.cookie('jwtRefresh', refreshToken, { 
          httpOnly: true,
          secure: true,
          // sameSite: 'none',
        });
       
        const { password, ...rest } = userObj
        return res.status(201).json({ success: true, data: rest });
      })
    })(req, res,  next)
  }
]

export const log_out = expressAsyncHandler(async (req, res, next) => {

  // set online status
  const authenticatedUser = req.authenticatedUser!
  await UserModel.findByIdAndUpdate(authenticatedUser.userid, {is_online: false}, {})

  const { jwt, jwtRefresh } = req.cookies;
  const result = await BlacklistModel.findOne({ token: jwt, type: 'ACCESS'}).exec()
  if (result !== null) {
    res.status(401).json({ message: 'Token already invalidated' });
    return
  }
  const BlacklistAccessToken = new BlacklistModel({
    token: jwt,
    type: 'ACCESS',
    reason: 'logout',
    blacklisted_at: Date.now()
  })
  await BlacklistAccessToken.save()
  const BlacklistRefreshToken = new BlacklistModel({
    token: jwtRefresh,
    type: 'REFRESH',
    reason: 'logout',
    blacklisted_at: Date.now()
  })
  await BlacklistRefreshToken.save()

  res.status(204).json({ message: 'Logout successful' })
})