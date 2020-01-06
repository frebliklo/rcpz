import { ArgsType, Field, Int, registerEnumType } from 'type-graphql'
import { Min, Max } from 'class-validator'

export enum DateOrderBy {
  CREATED_ASC = 'created_asc',
  CREATED_DESC = 'created_desc',
  UPDATED_ASC = 'updated_asc',
  UPDATED_DESC = 'updated_desc',
}

registerEnumType(DateOrderBy, {
  name: 'DateOrderBy',
  description: 'Sort by creation or update time',
})

@ArgsType()
export class PaginationArgs {
  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(25)
  skip?: number

  @Field(type => Int, { nullable: true })
  @Min(1)
  @Max(25)
  take?: number
}

@ArgsType()
export class PaginationSearchArgs extends PaginationArgs {
  @Field(type => String, { nullable: true, description: 'Text search' })
  query?: string
}

@ArgsType()
export class TodoPaginationArgs extends PaginationArgs {
  @Field(type => DateOrderBy, { nullable: true })
  orderByDate?: DateOrderBy

  @Field(type => Boolean, { nullable: true })
  orderByCompleted?: boolean
}
