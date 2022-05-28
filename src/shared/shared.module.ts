import { Module } from '@nestjs/common';
import { BankRepository } from './repository/bank.repo';
import { CategoryRepository } from './repository/category.repo';
import { TransactionRepository } from './repository/transaction.repo';
import { BankService } from './services/bank.service';
import { CategoryService } from './services/category.service';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [],
  providers: [
    BankService,
    CategoryService,
    TransactionService,
    BankRepository,
    CategoryRepository,
    TransactionRepository,
  ],
  exports: [BankService, CategoryService, TransactionService],
})
export class SharedModule {}
