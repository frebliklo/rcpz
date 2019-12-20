import { InputType, Field } from 'type-graphql'

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  firstName: string

  @Field(() => String, { nullable: true })
  lastName: string
}
