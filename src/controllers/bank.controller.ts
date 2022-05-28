import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankService } from 'src/shared/services/bank.service';
import { CreateBankDto, UpdateBankDto } from "src/shared/shared.dto";

@Controller('v1/api/bank')
@ApiTags('Bank')
export class BankController {
  constructor(private bankService: BankService) {}

  @Get('')
  @ApiOperation({ description: 'получить все' })
  async getAllBanks() {
    try {
      return this.bankService.getAllBanks();
    } catch (error) {
      return { success: false };
    }
  }

  @Get(':id')
  @ApiOperation({ description: 'получить один' })
  async getBank(@Body('name') name?: string, @Param('id') id?: number) {
    try {
      if (id) {
        return this.bankService.getBankById(id);
      } else if (name) {
        return this.bankService.getBankByName(name);
      } else {
        return { success: false, message: 'Provide at least name or id' };
      }
    } catch (error) {
      return { success: false };
    }
  }

  @Post('')
  @ApiOperation({ description: 'создать' })
  async createBank(@Body() bankData: CreateBankDto) {
    try {
      return this.bankService.createBank(bankData);
    } catch (error) {
      return { success: false };
    }
  }

  @Patch(':id')
  @ApiOperation({ description: 'отредактировать' })
  async updateBank(@Param('id') id: number, @Body() body: UpdateBankDto) {
    try {
      return this.bankService.updateBank(id, body);
    } catch (error) {
      return { success: false };
    }
  }

  @Delete(':id')
  @ApiOperation({ description: 'удалить' })
  async deleteBank(@Param('id') id: number) {
    try {
      return this.bankService.deleteBank(id);
    } catch (error) {
      return { success: false };
    }
  }
}
