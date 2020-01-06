import { ObjectType, Field, ID } from 'type-graphql'
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './User'
import { RelationColumn } from '../utils/entity/RelationColumn'

@ObjectType()
@Entity('todo_items')
export class TodoItem extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn('uuid')
  readonly id: string

  @Field(type => Boolean)
  @Column('bool', { default: false })
  completed: boolean

  @Field(type => Date)
  @CreateDateColumn()
  createdAt: Date

  @Field(type => Date)
  @UpdateDateColumn()
  updatedAt: Date

  @Field(type => String)
  @Column('text')
  title: string

  @Field(type => User)
  @ManyToOne(
    type => User,
    user => user.todos,
  )
  owner: User
  @RelationColumn()
  ownerId: string
}
