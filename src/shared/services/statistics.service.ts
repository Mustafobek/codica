import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionRepository } from "../repository/transaction.repo";
import logger from "../utils/logger";
import { BankTransactionsStatsDto } from "../shared.dto";
import { Between } from "typeorm";
import { TransactionTypeEnum } from "../models/Transaction.model";
import { BankService } from "./bank.service";

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(TransactionRepository)
    private transactionRepo: TransactionRepository,
    private bankService: BankService
  ) {
  }

  async getTransactionStatisticsInBank(query: BankTransactionsStatsDto) {
    try {
      const { bankId, startDate, endDate } = query;
      let [
        bankAccountTotalProfit,
        bankAccountTotalConsume,
        profitableTransactionsCount,
        consumableTransactionsCount,
        transactedCategories,
      ] = [0, 0, 0, 0, []];

      const bankData = await this.bankService.getBankById(bankId)

      const transactions = await this.transactionRepo.find({
        where: { bank: bankId, createdAt: Between(startDate, endDate) },
      });

      for (const transaction of transactions) {
        if (transaction.type === TransactionTypeEnum.profitable) {
          profitableTransactionsCount += 1
          bankAccountTotalProfit += transaction.amount
        } else {
          consumableTransactionsCount += 1
          bankAccountTotalConsume += transaction.amount
        }
        transactedCategories = transactedCategories.concat(transaction.category)
      }

      // make unique catIds
      transactedCategories = [...new Set(transactedCategories)].sort((a, b) => a - b)

      return {
        success: true,
        statistics: {
          bank: bankData.bank,
          bankAccountTotalProfit,
          bankAccountTotalConsume,
          profitableTransactionsCount,
          consumableTransactionsCount,
          transactedCategories,
        },
      };
    } catch (err) {
      logger.errorLog('Error while getting transactions stats in bank', err)
      return { success: false };
    }
  }
}
