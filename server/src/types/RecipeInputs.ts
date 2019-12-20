import { InputType, Field } from 'type-graphql'

// Recipe inputs
@InputType()
export class CreateRecipeInput {
  @Field(() => String)
  title: string

  @Field(() => String, { nullable: true })
  description: string

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  published: boolean
}

@InputType()
export class UpdateRecipeInput extends CreateRecipeInput {
  @Field(() => String, { nullable: true })
  title: string

  @Field(() => Boolean, { nullable: true })
  published: boolean
}
