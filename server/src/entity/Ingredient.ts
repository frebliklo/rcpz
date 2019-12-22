import { Field, ID, ObjectType, Int, registerEnumType } from 'type-graphql'
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'

import { Recipe } from './Recipe'
import { RelationColumn } from '../utils/entity/RelationColumn'
import { MeasurementEnum } from '../types/RecipeInputs'

registerEnumType(MeasurementEnum, {
  name: 'Measurement',
  description: 'Type of measurement for the ingredient',
})

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
  @Column('numeric', { nullable: true })
  amount?: number

  @Field(type => MeasurementEnum, { nullable: true })
  @Column({ type: 'enum', enum: MeasurementEnum, nullable: true })
  measurement?: MeasurementEnum

  @Field(type => Recipe)
  @ManyToOne(type => Recipe, { cascade: true })
  recipe: Recipe
  @RelationColumn()
  recipeId: string
}
