import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category.model";

export enum TransactionTypeEnum {
  profitable = 'PROFITABLE',
  consumable = 'CONSUMABLE'
} 

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('int')
  amount: number

  @Column()
  type: TransactionTypeEnum

  @Column({ default: new Date() })
  createdAt: Date;

  // categoryIds
  @Column('int', { array: true, default: [] })
  category: number[]

  // bankId
  @Column()
  bank: number
}