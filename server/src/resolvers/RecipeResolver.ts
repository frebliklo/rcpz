import {
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  Mutation,
  Arg,
  FieldResolver,
  Root,
  Args,
} from 'type-graphql'

import { Recipe } from '../entity/Recipe'
import { User } from '../entity/User'
import { isAuth } from '../middleware/type-graphql/isAuth'
import { Context } from '../types/Context'
import { CreateRecipeInput, UpdateRecipeInput } from '../types/RecipeInputs'
import { PaginationSearchArgs } from '../types/PaginationArgs'
import { getConnection } from 'typeorm'

@Resolver(of => Recipe)
export class RecipeResolver {
  @FieldResolver(type => User)
  async author(@Root() recipe: Recipe, @Ctx() { userLoader }: Context): Promise<User> {
    const user = await userLoader.load(recipe.authorId)

    if (!user) {
      throw new Error('Could not find author')
    }

    return user
  }

  @Query(type => [Recipe], { description: 'Find published recipes' })
  recipes(@Args() { skip, take, query }: PaginationSearchArgs): Promise<Recipe[]> {
    let recipes = getConnection()
      .getRepository(Recipe)
      .createQueryBuilder('r')
      .where('r.published = :published', { published: true })

    if (skip) recipes = recipes.skip(skip)
    if (take) recipes = recipes.take(take)
    if (query) {
      recipes = recipes
        .andWhere('r.title ilike :query', { query: `%${query}%` })
        .orWhere('r.description ilike :query', { query: `%${query}%` })
    }

    return recipes.getMany()
  }

  @Query(type => [Recipe], { description: 'Find the currently authenticated users recipes' })
  @UseMiddleware(isAuth)
  async myRecipes(@Ctx() { payload }: Context): Promise<Recipe[]> {
    if (!payload) throw new Error('No user in context')

    const recipes = await Recipe.find({ where: { authorId: payload.userId } })

    return recipes
  }

  @Mutation(type => Recipe, {
    description: 'Author a new recipe for the currently authenticated user',
  })
  @UseMiddleware(isAuth)
  async createRecipe(
    @Arg('data') data: CreateRecipeInput,
    @Ctx() { payload }: Context,
  ): Promise<Recipe> {
    if (!payload) throw new Error('No user in context')

    const recipe = await Recipe.create({
      ...data,
      authorId: payload.userId,
    }).save()

    return recipe
  }

  @Mutation(type => Recipe)
  @UseMiddleware(isAuth)
  async updateRecipe(
    @Arg('id') id: string,
    @Arg('data') data: UpdateRecipeInput,
    @Ctx() { payload }: Context,
  ): Promise<Recipe> {
    if (!payload) throw new Error('No user in context')

    // Check wether the recipe exists and the authenticated user is the owner
    await Recipe.findOneOrFail({ where: { id, authorId: payload.userId } })
    // Apply updates
    await Recipe.update(id, data)
    const recipe = await Recipe.findOneOrFail({ where: { id, authorId: payload.userId } })

    return recipe
  }

  @Mutation(type => Boolean)
  @UseMiddleware(isAuth)
  async deleteRecipe(@Arg('id') id: string, @Ctx() { payload }: Context): Promise<Boolean> {
    if (!payload) throw new Error('No user in context')

    const recipe = await Recipe.delete(id)

    return recipe.affected === 1 ? true : false
  }
}
