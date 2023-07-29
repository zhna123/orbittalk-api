import {Request, Response} from 'express'
import passport from 'passport'
import { Strategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import expressAsyncHandler from "express-async-handler";
import { BlacklistModel } from "../models/token_blacklist";
import { UserModel } from '../models/user'
import jwt from 'jsonwebtoken'
import * as jwtHelper from '../lib/jwt'

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
  const { jwtRefresh } = req.body;

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
    const user = jwt.verify(jwtRefresh, process.env.REFRESH_TOKEN_SECRET!);
    const token = jwtHelper.generateAccessToken(user)
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

export const log_in = (req: Request, res: Response, next: any) => {
  passport.authenticate('local', {session: false}, (err: any, user: any, info: any, status: any) => {
    if (err) { return next(err) }
    if (!user) { 
      return res.sendStatus(401)
    }
    // log in user
    req.login(user, {session: false}, err => {
      if (err) { return next(err) }
      // generate access token and expiration date
      const token = jwtHelper.generateAccessToken(user.toJSON())
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
      const refreshToken = jwtHelper.generateRefreshToken(user.toJSON())
      // refreshTokens.push(refreshToken)

      // set refresh token as http-only cookie
      res.cookie('jwtRefresh', refreshToken, { 
        httpOnly: true,
        secure: true,
        // sameSite: 'none',
      });

      return res.status(201).json({ success: true });
    })
  })(req, res,  next)
}

export const log_out = expressAsyncHandler(async (req, res, next) => {
  const { jwt, jwtRefresh } = req.body;
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