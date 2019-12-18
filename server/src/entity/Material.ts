import { Field, ID, ObjectType } from 'type-graphql'
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'

@ObjectType()
@Entity('materials')
export class Material extends BaseEntity {
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
}
