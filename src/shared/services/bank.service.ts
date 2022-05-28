import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from '../models/Bank.model';
import { BankRepository } from '../repository/bank.repo';
import { TransactionRepository } from '../repository/transaction.repo';
import { UpdateBankDto } from '../shared.dto';
import logger from '../utils/logger';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(BankRepository)
    private bankRepo: BankRepository,
  ) // @InjectRepository(TransactionRepository)
  // private transactionRepo: TransactionRepository
  {}

  // TODO: TYPEORM ERROR
  async getAllBanks() {
    try {
      const banks = await this.bankRepo.find({
        where: { createdAt: new Date(0) },
      });

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

  async createBank(name: string) {
    const bankExists = await this.getBankByName(name);

    if (bankExists.success) {
      throw new BadRequestException('Bank already exists');
    }

    const bank = new Bank();
    bank.name = name;
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

  // delete if only there is not transcations in bank
  async deleteBank(id: number) {
    const bankData = await this.getBankById(id);

    // use getTransactionsInBank method

    await this.bankRepo.delete({ id: bankData.bank.id });

    return { success: true };
  }
}
