import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category.model";

export enum TransactionTypeEnum {
  profitable = 'PORFITABLE',
  consumable = 'CONSUMABLE'
} 

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  amount: number

  @Column()
  type: TransactionTypeEnum

  @Column({ default: new Date() })
  createdAt: Date;

  // categoryIds
  @Column({ default: [] })
  category: number[]

  // bankId
  @Column()
  bank: number
}