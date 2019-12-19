import {
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  Arg,
  FieldResolver,
  Root,
  Mutation,
  InputType,
  Field,
} from 'type-graphql'

import { Recipe } from '../entity/Recipe'
import { TodoItem } from '../entity/Todoitem'
import { User } from '../entity/User'
import { isAuth } from '../middleware/type-graphql/isAuth'
import { Context } from '../types/Context'
import { getUserId } from '../utils/getUserId'

@InputType()
class UpdateUserInput {
  @Field(() => String, { nullable: true })
  firstName: string

  @Field(() => String, { nullable: true })
  lastName: string
}

@Resolver(of => User)
export class UserResolver {
  @FieldResolver(() => [Recipe])
  async recipes(@Root() user: User, @Ctx() { req }: Context): Promise<Recipe[]> {
    const userId = getUserId(req)

    if (userId === user.id) {
      const userRecipes = await Recipe.find({ where: { authorId: user.id } })

      return userRecipes
    }

    const recipes = await Recipe.find({ where: { authorId: user.id, published: true } })

    return recipes
  }

  @FieldResolver(() => [TodoItem])
  async todos(@Root() user: User, @Ctx() { req }: Context): Promise<TodoItem[]> {
    const userId = getUserId(req)

    if (!userId || userId !== user.id) return []

    const todos = await TodoItem.find({ where: { ownerId: user.id } })

    return todos
  }

  @Query(() => User, { description: 'Find the currently authenticated user' })
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: Context) {
    if (!payload) throw new Error('No user in context')

    return User.findOne({ where: { id: payload.userId } })
  }

  @Query(() => User, { description: 'Find a user by id' })
  async user(@Arg('id') id: string): Promise<User | null> {
    const user = await User.findOne({ where: { id } })

    if (!user) return null

    return user
  }

  @Query(() => [User])
  users() {
    return User.find()
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async updateUser(@Arg('data') data: UpdateUserInput, @Ctx() { payload }: Context): Promise<User> {
    if (!payload) throw new Error('No user in context')

    const changes: any = {}
    if (data.firstName) changes.first_name = data.firstName
    if (data.lastName) changes.last_name = data.lastName

    // Check wether the user is the currently authenticated user
    await User.findOneOrFail({ where: { id: payload.userId } })
    // Apply updates
    await User.update(payload.userId, { ...changes })
    // Refetch the user from db so we can return
    const user = await User.findOneOrFail({ where: { id: payload.userId } })

    return user
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUser(@Ctx() { payload }: Context): Promise<Boolean> {
    if (!payload) throw new Error('No user in context')

    const user = await User.delete(payload.userId)

    return user.affected === 1 ? true : false
  }
}
