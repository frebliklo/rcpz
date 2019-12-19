import { hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { User } from '../entity/User'

export function generateAccessToken(user: User) {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: process.env.NODE_ENV === 'production' ? '15m' : '2h',
  })
}

export function generateRefreshToken(user: User) {
  return sign(
    { userId: user.id, tokenVersion: user.token_version },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    },
  )
}

export function hashPassword(password: string) {
  return hash(password, 12)
}
