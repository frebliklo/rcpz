import { Resolver, Query, Ctx, UseMiddleware, Mutation, Arg } from 'type-graphql'

import { TodoItem } from '../entity/Todoitem'
import { isAuth } from '../middleware/type-graphql/isAuth'
import { MyContext } from '../Context.interface'

@Resolver(of => TodoItem)
export class TodoItemResolver {
  @Query(type => [TodoItem], { description: 'Get the list for the currently authenticated user' })
  @UseMiddleware(isAuth)
  myTodos(@Ctx() { payload }: MyContext): Promise<TodoItem[]> {
    if (!payload) throw new Error('No user in context')

    return TodoItem.find({ where: { ownerId: payload.userId }, order: { updatedAt: 'DESC' } })
  }

  @Mutation(type => TodoItem, { description: 'Add a todo to the currently authenticated user' })
  @UseMiddleware(isAuth)
  async addTodo(@Arg('title') title: string, @Ctx() { payload }: MyContext): Promise<TodoItem> {
    if (!payload) throw new Error('No user in context')

    const item = await TodoItem.create({
      title,
      ownerId: payload.userId,
    }).save()

    return item
  }

  @Mutation(type => TodoItem, { description: 'Toggle the completed status of a todo by id' })
  @UseMiddleware(isAuth)
  async toggleTodo(@Arg('id') id: string, @Ctx() { payload }: MyContext): Promise<TodoItem> {
    if (!payload) throw new Error('No user in context')

    const item = await TodoItem.findOneOrFail({ where: { id, ownerId: payload.userId } })
    await TodoItem.update(id, { completed: !item.completed })
    const updatedItem = await TodoItem.findOneOrFail({ where: { id, ownerId: payload.userId } })

    return updatedItem
  }
}
