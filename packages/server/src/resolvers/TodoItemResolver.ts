import { Resolver, Query, Ctx, UseMiddleware, Mutation, Arg, Args } from 'type-graphql'
import { getConnection } from 'typeorm'

import { TodoItem } from '../entity/Todoitem'
import { isAuth } from '../middleware/type-graphql/isAuth'
import { Context } from '../types/Context'
import { TodoPaginationArgs, DateOrderBy } from '../types/PaginationArgs'

@Resolver(of => TodoItem)
export class TodoItemResolver {
  @Query(type => [TodoItem], { description: 'Get the list for the currently authenticated user' })
  @UseMiddleware(isAuth)
  myTodos(
    @Args() { skip, take, orderByDate, orderByCompleted }: TodoPaginationArgs,
    @Ctx() { payload }: Context,
  ): Promise<TodoItem[]> {
    if (!payload) throw new Error('No user in context')

    let todos = getConnection()
      .getRepository(TodoItem)
      .createQueryBuilder('t')
      .where('t.ownerId = :ownerId', { ownerId: payload.userId })

    if (skip) todos = todos.skip(skip)
    if (take) todos = todos.take(take)

    switch (orderByDate) {
      case DateOrderBy.CREATED_ASC:
        todos = todos.orderBy('t.createdAt', 'ASC')
        break
      case DateOrderBy.CREATED_DESC:
        todos = todos.orderBy('t.createdAt', 'DESC')
        break
      case DateOrderBy.UPDATED_ASC:
        todos = todos.orderBy('t.updatedAt', 'ASC')
        break
      case DateOrderBy.UPDATED_DESC:
        todos = todos.orderBy('t.updatedAt', 'DESC')
        break
    }

    if (orderByCompleted === false) todos = todos.addOrderBy('t.completed', 'ASC')
    if (orderByCompleted === true) todos = todos.addOrderBy('t.completed', 'DESC')

    return todos.getMany()
  }

  @Mutation(type => TodoItem, { description: 'Add a todo to the currently authenticated user' })
  @UseMiddleware(isAuth)
  async addTodo(@Arg('title') title: string, @Ctx() { payload }: Context): Promise<TodoItem> {
    if (!payload) throw new Error('No user in context')

    const item = await TodoItem.create({
      title,
      ownerId: payload.userId,
    }).save()

    return item
  }

  @Mutation(type => TodoItem, { description: 'Toggle the completed status of a todo by id' })
  @UseMiddleware(isAuth)
  async toggleTodo(@Arg('id') id: string, @Ctx() { payload }: Context): Promise<TodoItem> {
    if (!payload) throw new Error('No user in context')

    const item = await TodoItem.findOneOrFail({ where: { id, ownerId: payload.userId } })
    await TodoItem.update(id, { completed: !item.completed })
    const updatedItem = await TodoItem.findOneOrFail({ where: { id, ownerId: payload.userId } })

    return updatedItem
  }
}
