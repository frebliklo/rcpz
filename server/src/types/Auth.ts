import { ObjectType, Field, InputType, registerEnumType } from 'type-graphql'

import { User } from '../entity/User'
import { UserRole } from './UserInput'

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Possible roles for a user',
})

@ObjectType()
export class AuthResponse {
  @Field(type => String)
  accessToken: string

  @Field(type => User)
  user: User
}

@InputType()
export class SignInInput {
  @Field(type => String)
  email: string

  @Field(type => String)
  password: string
}

@InputType()
export class RegisterInput extends SignInInput {
  @Field(type => String)
  firstName: string

  @Field(type => String, { nullable: true })
  lastName?: string

  @Field(type => UserRole, { nullable: true })
  role?: UserRole
}

export type AuthToken = {
  userId: number | string
  iat: number
  exp: number
}
