import { ObjectType, Field, ID } from 'type-graphql'
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { User } from './User'

import { RelationColumn } from '../utils/entity/RelationColumn'

@ObjectType()
@Entity('recipes')
export class Recipe extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @Field()
  @Column('text')
  title: string

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  photo?: string

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  items?: string

  @Field(() => Boolean)
  @Column('bool', { default: false })
  published: boolean

  @Field(() => User)
  @ManyToOne(() => User)
  author: User
  @RelationColumn()
  authorId: string
}
