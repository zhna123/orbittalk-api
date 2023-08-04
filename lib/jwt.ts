import dotenv from 'dotenv'
dotenv.config()

import jwt, { JwtPayload } from 'jsonwebtoken';

// Define the custom JWT payload interface
export interface CustomJwtPayload extends JwtPayload {
  username: string;
  userid: string;
}

export function generateAccessToken(user: any) {
  return jwt.sign({username: user.username, userid: user._id}, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '900s'})
}

export function getExpirationDate() {
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 900 * 1000); // 15m from now
  return expirationDate;
}

export function generateRefreshToken(user: any) {
  return jwt.sign({username: user.username, userid: user._id}, process.env.REFRESH_TOKEN_SECRET!);
}

export function verifyJWT(token: string, secretKey: string): CustomJwtPayload | null {
  try {
    const user = jwt.verify(token, secretKey);
    return user as CustomJwtPayload;
  } catch (err) {
    // If the token is invalid or has expired
    console.error('JWT verification failed:', err);
    return null;
  }
}
