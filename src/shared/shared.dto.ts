import { TransactionTypeEnum } from "./models/Transaction.model";
import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBankDto {
  @IsNotEmpty()
  name?: string;

  balance?: number;
}

export class TransactionPaginationOptionsDto {
  page?: number;
  limit?: number;
}

export interface AxiosResponse {
  success: boolean

  data: {
    amount: number
    type: TransactionTypeEnum
  }
}

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string
}

export class CreateBankDto {
  @IsNotEmpty()
  name: string
}

export class CreateTransactionDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  type: TransactionTypeEnum;

  @IsNotEmpty()
  bank: number;

  @IsNotEmpty()
  category: number[];
}

export class BankTransactionsStatsDto {
  @IsNotEmpty()
  @ApiProperty()
  bankId: number

  @IsNotEmpty()
  @ApiProperty()
  startDate: Date

  @IsNotEmpty()
  @ApiProperty()
  endDate: Date
}