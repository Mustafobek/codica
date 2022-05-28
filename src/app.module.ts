import { Module } from '@nestjs/common';
import { BankController } from './controllers/bank.controller';
import { TransactionController } from './controllers/transaction.controller';
import { CategoryController } from './controllers/category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormConfig } from './configs/typeorm.config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeormConfig), SharedModule],
  controllers: [BankController, TransactionController, CategoryController],
  providers: []
})
export class AppModule {}
