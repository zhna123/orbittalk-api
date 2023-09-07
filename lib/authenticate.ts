import express, { Request, Response } from 'express'
import { BlacklistModel } from '../models/token_blacklist';
import * as jwtHelper from '../lib/jwt'


export async function authenticateToken(req: Request, res: Response, next: any) {
  try {
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
  } catch(err) {
    console.log('error authenticate token..' + err)
  }
}