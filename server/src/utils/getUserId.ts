import { Request } from 'express'
import { verify } from 'jsonwebtoken'

import { AuthToken } from '../types/AuthToken'

export const getUserId = (req: Request) => {
  const authorization = req.headers['authorization']

  if (!authorization) {
    return null
  }

  const token = authorization?.split(' ')[1]
  const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET!) as AuthToken

  return decoded.userId
}
