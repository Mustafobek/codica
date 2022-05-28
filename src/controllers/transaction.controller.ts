import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { TransactionService } from "../shared/services/transaction.service";
import {
  CreateTransactionDto,
  TransactionPaginationOptionsDto,
} from "../shared/shared.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller('v1/api/transaction')
@ApiTags('Transactions')
export class TransactionController {
  constructor(
    private transactionService: TransactionService
  ) {
  }

  @Get('')
  @ApiOperation({ description: 'получить все' })
  async getAllTransactions(
    @Query() query: TransactionPaginationOptionsDto
  ) {
    try {
      return this.transactionService.getAllTransactions(query)
    } catch (err) {
      return { success: false };
    }
  }

  @Get(':id')
  @ApiOperation({ description: 'получить один' })
  async getTransaction(
    @Param('id') id: number
  ) {
    try {
      return this.transactionService.getTransaction(id)
    } catch (err) {
      return { success: false };
    }
  }

  @Post('')
  @ApiOperation({ description: 'создать через вебхук' })
  async createTransactionViaWebhook(
    @Body('bankId') bankId: number,
    @Body('categoryIds') categoryIds: number[]
  ) {
    try {
      return this.transactionService.createTransaction(bankId, categoryIds)
    } catch (err) {
      return { success: false }
    }
  }

  @Post('in-app')
  @ApiOperation({ description: 'создать через этот апп' })
  async createTransactionViaApp(
    @Body() transactionData: CreateTransactionDto
  ) {
    try {
      return this.transactionService.createTransactionInApp(transactionData)
    } catch (err) {
      return { success: false };
    }
  }
}
