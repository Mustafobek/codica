import { TransactionTypeEnum } from "./models/Transaction.model";

export class UpdateBankDto {
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
  name: string
}

export class CreateBankDto {
  name: string
}

export class CreateTransactionDto {
  amount: number;
  type: TransactionTypeEnum;
  bank: number;
  category: number[];
}
