import {
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  Mutation,
  InputType,
  Field,
  Arg,
  FieldResolver,
  Root,
} from 'type-graphql'

import { Recipe } from '../entity/Recipe'
import { User } from '../entity/User'
import { isAuth } from '../middleware/type-graphql/isAuth'
import { Context } from '../types/Context'

@InputType()
class CreateRecipeInput {
  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  description: string

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  published: boolean
}

@InputType()
class UpdateRecipeInput extends CreateRecipeInput {
  @Field(() => String, { nullable: true })
  title: string

  @Field(() => Boolean, { nullable: true })
  published: boolean
}

@Resolver(of => Recipe)
export class RecipeResolver {
  @FieldResolver(() => User)
  async author(@Root() recipe: Recipe, @Ctx() { userLoader }: Context): Promise<User> {
    const user = await userLoader.load(recipe.authorId)

    if (!user) {
      throw new Error('Could not find author')
    }

    return user
  }

  @Query(() => [Recipe], { description: 'Find the currently authenticated users recipes' })
  @UseMiddleware(isAuth)
  async myRecipes(@Ctx() { payload }: Context): Promise<Recipe[]> {
    if (!payload) throw new Error('No user in context')

    const recipes = await Recipe.find({ where: { authorId: payload.userId } })

    return recipes
  }

  @Mutation(() => Recipe, {
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

  @Mutation(() => Recipe)
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteRecipe(@Arg('id') id: string, @Ctx() { payload }: Context): Promise<Boolean> {
    if (!payload) throw new Error('No user in context')

    const recipe = await Recipe.delete(id)

    return recipe.affected === 1 ? true : false
  }
}
