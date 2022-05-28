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
  data: object
}