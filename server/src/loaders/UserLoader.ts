import DataLoader from 'dataloader'

import { User } from '../entity/User'

type BatchUsers = (ids: readonly string[]) => Promise<User[]>

const batchUsers: BatchUsers = async ids => {
  const users = await User.findByIds(Array.from(ids))

  const userMap: { [key: string]: User } = {}
  users.forEach(user => {
    userMap[user.id] = user
  })

  return ids.map(id => userMap[id])
}

export const userLoader = () => new DataLoader<string, User>(batchUsers)
