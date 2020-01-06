import {
  Resolver,
  Query,
  Ctx,
  UseMiddleware,
  Arg,
  FieldResolver,
  Root,
  Mutation,
  Args,
} from 'type-graphql'

import { Recipe } from '../entity/Recipe'
import { TodoItem } from '../entity/Todoitem'
import { User } from '../entity/User'
import { isAuth } from '../middleware/type-graphql/isAuth'
import { Context } from '../types/Context'
import { UpdateUserInput } from '../types/UserInput'
import { getUserId } from '../utils/getUserId'
import { PaginationSearchArgs } from '../types/PaginationArgs'
import { getConnection } from 'typeorm'

@Resolver(of => User)
export class UserResolver {
  @FieldResolver(type => [Recipe])
  async recipes(@Root() user: User, @Ctx() { req }: Context): Promise<Recipe[]> {
    const userId = getUserId(req)

    if (userId === user.id) {
      const userRecipes = await Recipe.find({ where: { authorId: user.id } })

      return userRecipes
    }

    const recipes = await Recipe.find({ where: { authorId: user.id, published: true } })

    return recipes
  }

  @FieldResolver(type => [TodoItem])
  async todos(@Root() user: User, @Ctx() { req }: Context): Promise<TodoItem[]> {
    const userId = getUserId(req)

    if (!userId || userId !== user.id) return []

    const todos = await TodoItem.find({ where: { ownerId: user.id } })

    return todos
  }

  @Query(type => User, { description: 'Find the currently authenticated user' })
  @UseMiddleware(isAuth)
  me(@Ctx() { payload }: Context) {
    if (!payload) throw new Error('No user in context')

    return User.findOne({ where: { id: payload.userId } })
  }

  @Query(type => User, { description: 'Find a user by id' })
  async user(@Arg('id') id: string): Promise<User | null> {
    const user = await User.findOne({ where: { id } })

    if (!user) return null

    return user
  }

  @Query(type => [User])
  users(@Args() { skip, take, query }: PaginationSearchArgs): Promise<User[]> {
    let users = getConnection()
      .getRepository(User)
      .createQueryBuilder('u')

    if (skip) users = users.skip(skip)
    if (take) users = users.take(take)
    if (query) {
      users = users
        .andWhere('u.first_name ilike :query', { query: `%${query}%` })
        .orWhere('u.last_name ilike :query', { query: `%${query}%` })
    }

    return users.getMany()
  }

  @Mutation(type => User)
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

  @Mutation(type => Boolean)
  @UseMiddleware(isAuth)
  async deleteUser(@Ctx() { payload }: Context): Promise<Boolean> {
    if (!payload) throw new Error('No user in context')

    const user = await User.delete(payload.userId)

    return user.affected === 1 ? true : false
  }
}
