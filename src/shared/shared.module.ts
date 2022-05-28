import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from './models/Bank.model';
import { Category } from './models/Category.model';
import { Transaction } from './models/Transaction.model';
import { BankRepository } from './repository/bank.repo';
import { CategoryRepository } from './repository/category.repo';
import { TransactionRepository } from './repository/transaction.repo';
import { BankService } from './services/bank.service';
import { CategoryService } from './services/category.service';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankRepository,
      CategoryRepository,
      TransactionRepository,
    ]),
  ],
  providers: [
    BankService,
    CategoryService,
    TransactionService,
  ],
  exports: [BankService, CategoryService, TransactionService],
})
export class SharedModule {}
