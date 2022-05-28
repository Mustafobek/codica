import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { WEBHOOK_API, WEBHOOK_API_CONFIG } from 'src/constants';
import { Transaction } from '../models/Transaction.model';
import { TransactionRepository } from '../repository/transaction.repo';
import { AxiosResponse, TransactionPaginationOptionsDto } from '../shared.dto';
import logger from '../utils/logger';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepo: TransactionRepository,
  ) {}

  async isAnyTransactionsInBank(bankId: number) {
    try {
      const transactions = await this.transactionRepo.count({
        where: { bank: bankId },
      });

      // if(transactions) {}

      logger.infoLog(transactions);
    } catch (error) {
      logger.errorLog('Error while getting transactions in bank', error);
      return { success: false };
    }
  }

  async isAnyTransactionsInCategory(categoryId: number) {
    try {
      const transactions = await this.transactionRepo.count({
        where: { category: categoryId },
      });

      logger.infoLog(transactions);
    } catch (error) {
      logger.errorLog('Error while getting transactions in bank', error);
    }
  }

  async getAllTransactions(paginationOptions: TransactionPaginationOptionsDto) {
    try {
      const transactions = await this.transactionRepo.find();

      return { success: true, transactions };
    } catch (err) {
      logger.errorLog('Error while getAllTransactions', err);
      return { success: false };
    }
  }

  async getTransaction(id: number) {
    try {
      const transaction = await this.transactionRepo.findOne({ where: { id } });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      return { success: true, transaction };
    } catch (error) {
      logger.errorLog('Error while getTransaction by id', error);
      return { success: false };
    }
  }

  async deleteTransaction(id: number) {
    try {
      const transactionData = await this.getTransaction(id);

      await this.transactionRepo.delete({ id: transactionData.transaction.id });

      return { success: true };
    } catch (error) {
      logger.errorLog('Error while delete transaction', error);
      return { success: false };
    }
  }

  async createTransaction(bankId: number, categoryIds: number[]) {
    try {
      const transactionData: AxiosResponse = await axios.get(
        WEBHOOK_API,
        WEBHOOK_API_CONFIG,
      );

      if (!transactionData.success) {
        throw new BadRequestException('Axios response error');
      }

      const transaction = new Transaction();

      for (const key in transactionData.data) {
        transaction[key] = transactionData.data[key];
      }
      transaction.bank = bankId;
      transaction.category.concat(categoryIds);

      await transaction.save();

      return { success: true, transaction };
    } catch (error) {
      logger.errorLog('Error while create transaction', error);
      return { success: false };
    }
  }
}
