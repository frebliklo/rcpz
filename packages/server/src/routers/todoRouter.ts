import { Router, Request, Response } from 'express'
import { getConnection } from 'typeorm'

import { TodoItem } from '../entity/Todoitem'
import { DateOrderBy } from '../types/PaginationArgs'
import { TodoListRequest } from '../types/Routers'
import { getUserId } from '../utils/getUserId'

export const router = Router()

router.get('/', async (req: TodoListRequest, res: Response) => {
  const userId = getUserId(req)

  if (!userId) res.status(400).send('You need to be authenticated')

  const { skip, take, orderByDate, orderByCompleted } = req.query

  let todos = getConnection()
    .getRepository(TodoItem)
    .createQueryBuilder('t')
    .where('t.ownerId = :ownerId', { ownerId: userId })

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

  try {
    const list = await todos.getMany()

    res.send(list)
  } catch (error) {
    res.status(401).send(`Something went wrong: ${error}`)
  }
})
