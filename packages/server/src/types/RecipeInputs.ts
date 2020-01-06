import { InputType, Field, Int, registerEnumType } from 'type-graphql'

// Recipe inputs
@InputType()
export class CreateRecipeInput {
  @Field(type => String)
  title: string

  @Field(type => String, { nullable: true })
  description: string

  @Field(type => Boolean, { nullable: true, defaultValue: false })
  published: boolean

  @Field(type => [IngredientInput])
  ingredients: IngredientInput[]
}

@InputType()
export class UpdateRecipeInput extends CreateRecipeInput {
  @Field(type => String, { nullable: true })
  title: string

  @Field(type => Boolean, { nullable: true })
  published: boolean

  @Field(type => [IngredientInput])
  ingredients: IngredientInput[]

  @Field(type => [String], { nullable: true })
  removeIngredients: string[]
}

export enum MeasurementEnum {
  PINCH = 'pinch',
  TEASPOON = 'tsp',
  TABLESPOON = 'tbs',
  ML = 'ml',
  CL = 'cl',
  DL = 'dl',
  L = 'l',
  G = 'g',
  KG = 'kg',
  CUP = 'cup',
}

registerEnumType(MeasurementEnum, {
  name: 'Measurement',
  description: 'Type of measurement for the ingredient',
})

@InputType()
export class IngredientInput {
  @Field(type => String)
  title: string

  @Field(type => String, { nullable: true })
  description?: string

  @Field(type => Int, { nullable: true })
  amount?: number

  @Field(type => MeasurementEnum, { nullable: true })
  measurement?: MeasurementEnum
}
