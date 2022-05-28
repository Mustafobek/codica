import { Controller } from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { StatisticsService } from "../shared/services/statistics.service";

@Controller('v1/api/statistics')
@ApiTags('Statistics')
export class StatisticsController {
  constructor(
    private statsService: StatisticsService
  ) {
  }
}
