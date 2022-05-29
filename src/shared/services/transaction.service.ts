import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { WEBHOOK_API, WEBHOOK_API_CONFIG } from "src/constants";
import { Transaction, TransactionTypeEnum } from "../models/Transaction.model";
import { TransactionRepository } from "../repository/transaction.repo";
import { AxiosResponse, CreateTransactionDto, TransactionPaginationOptionsDto } from "../shared.dto";
import logger from "../utils/logger";
import { BankRepository } from "../repository/bank.repo";
import { BankService } from "./bank.service";
import { CategoryService } from "./category.service";
import { CategoryRepository } from "../repository/category.repo";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepo: TransactionRepository,
    @InjectRepository(BankRepository)
    private bankRepo: BankRepository,
    @InjectRepository(CategoryRepository)
    private categoryRepo: CategoryRepository
  ) {}

  async isAnyTransactionsInBank(bankId: number) {
    try {
      const transactions = await this.transactionRepo.count({
        where: { bank: bankId },
      });

      return { success: true, transactions };
    } catch (error) {
      logger.errorLog('Error while getting transactions in bank', error);
      return { success: false };
    }
  }

  async isAnyTransactionsInCategory(categoryId: number) {
    try {
      const transactions = await this.transactionRepo
        .createQueryBuilder('Transaction')
        .where('Transaction.category IN (:categoryId)', {
          categoryId: [categoryId],
        })
        .orderBy('Transaction.createdAt')
        .getMany()

      return { success: true, transactions: transactions.length}
    } catch (error) {
      logger.errorLog('Error while getting transactions in bank', error);
    }
  }

  async getAllTransactions(paginationOptions: TransactionPaginationOptionsDto) {
    try {
      const limit = paginationOptions.limit ? paginationOptions.limit : 10
      const page = paginationOptions.page ? paginationOptions.page : 1

      const transactions = await this.transactionRepo.findAndCount({
        take: limit,
        skip: (page - 1) * limit
      });

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

  async createTransaction(bankId: number, categoryIds: number[]) {
    try {
      const transactionData: AxiosResponse = await axios.get(
        WEBHOOK_API,
        WEBHOOK_API_CONFIG,
      );

      if (!transactionData.success) {
        throw new BadRequestException('Axios response error');
      }

      const {
        data: { type, amount },
      } = transactionData;

      const bank = await this.bankRepo.findOne({ where: { id: bankId } });

      if(!bank) {
        throw new NotFoundException('Bank not found')
      }

      const transaction = new Transaction();

      for (const key in transactionData.data) {
        transaction[key] = transactionData.data[key];
      }
      transaction.bank = bankId;

      // check category exists
      for (const catId of categoryIds) {
        const category = await this.categoryRepo.findOne({
          where: { id: catId },
        });
        console.log(category)

        if(!category) {
          return { success: false, message: `Category with id :${catId} not found`}
        }
      }

      transaction.category.concat(categoryIds);
      await transaction.save();

      // update bank balance
      if (type === TransactionTypeEnum.consumable) {
        bank.balance -= amount
      } else {
        bank.balance += amount
      }

      await bank.save()

      return { success: true, transaction };
    } catch (error) {
      logger.errorLog('Error while create transaction', error);
      return { success: false };
    }
  }

  async createTransactionInApp(transactionData: CreateTransactionDto) {
    try {
      const { amount, type, bank: bankId, category } = transactionData;

      const bank = await this.bankRepo.findOne({ where: { id: bankId } });

      if(!bank) {
        throw new NotFoundException('Bank not found')
      }

      const transaction = new Transaction()

      for (const key in transactionData) {
        transaction[key] = transactionData[key]
      }

      // check category exists
      for (const catId of category) {
        const category = await this.categoryRepo.findOne({
          where: { id: catId },
        });

        if(!category) {
          return { success: false, message: `Category with id :${catId} not found`}
        }
      }


      // update bank balance
      if (type === TransactionTypeEnum.consumable) {
        bank.balance -= amount
      } else {
        bank.balance += amount
      }

      await transaction.save();
      await bank.save()

      return { success: true, transaction };
    } catch (error) {
      logger.errorLog('Error while create transaction in app', error);
      return { success: false };
    }
  }

  async deleteTransaction(id: number) {
    try {
      const { transaction, success } = await this.getTransaction(id);

      if(success) {
        const bank = await this.bankRepo.findOne({where: {id: transaction.bank}})

        // if money was profit then it will be removed
        if(transaction.type === TransactionTypeEnum.profitable) {
          bank.balance -= transaction.amount
        } else {
          bank.balance += transaction.amount
        }

        await this.transactionRepo.delete({ id });

        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      logger.errorLog('Error while deleting transaction', error);
      return { success: false };
    }
  }
}
