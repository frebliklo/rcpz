import { ObjectType, Field, ID } from 'type-graphql'
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { User } from './User'

import { RelationColumn } from '../utils/entity/RelationColumn'
import { Ingredient } from './Ingredient'

@ObjectType()
@Entity('recipes')
export class Recipe extends BaseEntity {
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

  @OneToMany(
    type => Ingredient,
    ingredient => ingredient.recipe,
  )
  ingredients: Ingredient[]

  @Field(type => Boolean)
  @Column('bool', { default: false })
  published: boolean

  @Field(type => User)
  @ManyToOne(type => User)
  author: User
  @RelationColumn()
  authorId: string
}
