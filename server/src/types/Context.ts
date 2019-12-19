import { Request, Response } from 'express'

import { userLoader } from '../loaders/UserLoader'

export interface Context {
  req: Request
  res: Response
  payload?: { userId: string }
  userLoader: ReturnType<typeof userLoader>
}
