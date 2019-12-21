import { Field, ID, ObjectType, Int } from 'type-graphql'
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

import { Recipe } from './Recipe'
import { RelationColumn } from '../utils/entity/RelationColumn'

@ObjectType()
@Entity('ingredients')
export class Ingredient extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @Field(type => String)
  @Column('text')
  title: string

  @Field(type => String, { nullable: true })
  @Column('text', { nullable: true })
  description?: string

  @Field(type => String, { nullable: true })
  @Column('text', { nullable: true })
  photo?: string

  @Field(type => Int, { nullable: true })
  @Column('number', { nullable: true })
  amount?: number

  @Field(type => Recipe)
  @ManyToOne(type => Recipe)
  recipe: Recipe
  @RelationColumn()
  recipeId: string
}
