import { Request, Response } from 'express'

import { recipeLoader } from '../loaders/RecipeLoader'
import { userLoader } from '../loaders/UserLoader'

export interface Context {
  req: Request
  res: Response
  payload?: { userId: string }
  recipeLoader: ReturnType<typeof recipeLoader>
  userLoader: ReturnType<typeof userLoader>
}
