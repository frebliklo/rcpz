import { Request } from 'express'

import { DateOrderBy } from './PaginationArgs'
import { UserRole } from './UserInput'

export interface SingInRequest extends Request {
  body: {
    email: string
    password: string
    first_name: string
    last_name: string
    role?: UserRole
  }
}

export interface TodoListRequest extends Request {
  query: {
    skip: number
    take: number
    orderByDate: DateOrderBy
    orderByCompleted: boolean
  }
}
