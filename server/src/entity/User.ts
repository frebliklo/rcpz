import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm'
import { ObjectType, Field, Int, ID, Root, Ctx, registerEnumType } from 'type-graphql'

import { Recipe } from './Recipe'
import { TodoItem } from './Todoitem'
import { Context } from '../types/Context'
import { getUserId } from '../utils/getUserId'

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Possible roles for a user',
})

@ObjectType()
@Entity('users')
export class User extends BaseEntity {
  // ID
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  // Role
  @Field(type => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER })
  role: UserRole

  // First name
  @Field(type => String, { name: 'firstName' })
  @Column('text')
  first_name: string

  // Last name
  @Field(type => String, { name: 'lastName', nullable: true })
  @Column('text', { nullable: true })
  last_name: string

  // Full name field
  @Field(type => String)
  fullName(@Root() user: User) {
    return `${user.first_name} ${user.last_name}`
  }

  // Email
  @Column('text', { unique: true })
  email: string

  @Column('bool', { default: false })
  email_verified: boolean

  @Field(type => String, { nullable: true, name: 'email' })
  emailField(@Root() user: User, @Ctx() { req }: Context) {
    const userId = getUserId(req)

    if (userId === user.id) {
      return user.email
    }

    return null
  }

  @Field(type => Boolean, { nullable: true, name: 'emailVerified' })
  emailVerifiedField(@Root() user: User, @Ctx() { req }: Context) {
    const userId = getUserId(req)

    if (userId === user.id) {
      return user.email_verified
    }

    return null
  }

  // Password - should never be exposed
  @Column('text')
  password: string

  // Token version - for managing refresh tokens
  @Column('int', { default: 0 })
  token_version: number

  @Field(type => Int, {
    nullable: true,
    name: 'tokenVersion',
    description: 'Get the refresh token version for the currently authenticated user',
  })
  tokenVersionField(@Root() user: User, @Ctx() { req }: Context) {
    const userId = getUserId(req)

    if (userId === user.id) {
      return user.token_version
    }

    return null
  }

  // Recipes
  @OneToMany(
    type => Recipe,
    recipe => recipe.author,
  )
  recipes: Recipe[]

  // Todos
  @OneToMany(
    type => TodoItem,
    todoItem => todoItem.owner,
  )
  todos: TodoItem[]
}
