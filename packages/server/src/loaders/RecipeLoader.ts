import DataLoader from 'dataloader'

import { Recipe } from '../entity/Recipe'

type BatchRecipes = (ids: readonly string[]) => Promise<Recipe[]>

const batchRecipes: BatchRecipes = async ids => {
  const recipes = await Recipe.findByIds(Array.from(ids))

  const recipeMap: { [key: string]: Recipe } = {}
  recipes.forEach(recipe => {
    recipeMap[recipe.id] = recipe
  })

  return ids.map(id => recipeMap[id])
}

export const recipeLoader = () => new DataLoader<string, Recipe>(batchRecipes)
