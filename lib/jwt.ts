import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'

export function generateAccessToken(user: any) {
  return jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '900s'})
}

export function getExpirationDate() {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 900 * 1000); // 15m from now
  return expirationDate;
}

export function generateRefreshToken(user: any) {
  return jwt.sign({username: user.username}, process.env.REFRESH_TOKEN_SECRET!);
}