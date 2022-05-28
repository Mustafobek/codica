import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '../models/Bank.model';
import { BankRepository } from '../repository/bank.repo';
import { CreateBankDto, UpdateBankDto } from "../shared.dto";
import logger from '../utils/logger';
import { TransactionService } from "./transaction.service";

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(BankRepository)
    private bankRepo: BankRepository,
    private transactionService: TransactionService
  )
  {}

  async getAllBanks() {
    try {
      const banks = await this.bankRepo.find({});

      return { success: true, banks };
    } catch (error) {
      logger.errorLog('Error while get all banks', error);
      return { success: false };
    }
  }

  async getBankById(id: number) {
    const bank = await this.bankRepo.findOne({ where: { id } });

    if (!bank) {
      throw new NotFoundException(`Task not found`);
    }

    return { success: true, bank };
  }

  async getBankByName(name: string) {
    const bank = await this.bankRepo.findOne({ where: { name } });

    if (!bank) {
      throw new NotFoundException(`Task not found`);
    }

    return { success: true, bank };
  }

  async createBank(bankData: CreateBankDto) {
    const bankExists = await this.bankRepo.findOne({
      where: {
        name: bankData.name
      }
    });

    if (bankExists) {
      throw new BadRequestException('Bank already exists');
    }

    const bank = new Bank();
    bank.name = bankData.name;
    await bank.save();

    return { success: true, bank };
  }

  async updateBank(id: number, updateData: UpdateBankDto) {
    const bankData = await this.getBankById(id);
    const { bank } = bankData;

    for (const key in updateData) {
      if (updateData[key]) {
        bank[key] = updateData[key];
      }
    }
    await bank.save();

    return { success: true };
  }

  // delete if only there is not transactions in bank
  async deleteBank(id: number) {
    const bankData = await this.getBankById(id);
    const transactionsExistInBank = await this.transactionService.isAnyTransactionsInBank(id)

    if(transactionsExistInBank.success) {
      if(transactionsExistInBank.transactions) {
        return { success: false, message: 'There are some transactions in bank' };
      } else {
        await this.bankRepo.delete({ id: bankData.bank.id });
        return { success: true };
      }
    }

    return { success: false };
  }
}
