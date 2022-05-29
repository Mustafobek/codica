import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { StatisticsService } from "../shared/services/statistics.service";
import { BankTransactionsStatsDto } from "../shared/shared.dto";

@Controller('v1/api/statistics')
@ApiTags('Statistics')
export class StatisticsController {
  constructor(
    private statsService: StatisticsService
  ) {
  }

  @Get('')
  @ApiOperation({ description: 'Получить статичстику' })
  async getTransactionStatsInBank(
    @Query() query: BankTransactionsStatsDto
  ) {
    try {
      return this.statsService.getTransactionStatisticsInBank(query)
    } catch (err) {
      return { success: false };
    }
  }
}

