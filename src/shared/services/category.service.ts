import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../models/Category.model';
import { CategoryRepository } from '../repository/category.repo';
import { CreateCategoryDto } from '../shared.dto';
import logger from '../utils/logger';
import { TransactionService } from './transaction.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepo: CategoryRepository,
    private transactionService: TransactionService,
  ) {}

  async getAllCategories() {
    try {
      const cats = await this.categoryRepo.find({});

      return { success: true, cats };
    } catch (error) {
      logger.errorLog('Error while getAllCategories', error);
      return { success: false };
    }
  }

  async getCategoryById(id: number) {
    try {
      const cat = await this.categoryRepo.findOne({ where: { id } });

      if (!cat) {
        throw new NotFoundException('Category not found');
      }

      return { success: true, cat };
    } catch (error) {
      logger.errorLog('Error while getting category by id', error);
      return { success: false };
    }
  }

  async getCategoryByName(name: string) {
    try {
      const cat = await this.categoryRepo.findOne({ where: { name } });

      if (!cat) {
        throw new NotFoundException('Category not found');
      }

      return { success: true, cat };
    } catch (error) {
      logger.errorLog('Error while getting category by name', error);
      return { success: false };
    }
  }

  async createCategory(categoryData: CreateCategoryDto) {
    try {
      const catExists = await this.categoryRepo.findOne({
        where: { name: categoryData.name },
      });

      if (catExists) {
        throw new BadRequestException('Cat exists');
      }

      const cat = new Category();
      cat.name = categoryData.name;
      await cat.save();

      return { success: true, cat };
    } catch (error) {
      logger.errorLog('Error while creating category', error);
      return { success: false };
    }
  }

  async updateCategory(id: number, name: string) {
    try {
      const catData = await this.getCategoryById(id);

      catData.cat.name = name;
      await catData.cat.save();

      return { success: true, cat: catData.cat };
    } catch (error) {
      logger.errorLog('Error while update category', error);
      return { success: false };
    }
  }

  // delete if only there is not any transactions in category
  async deleteCategory(id: number) {
    const categoryInfo = await this.getCategoryById(id);
    const transactionsInCategory =
      await this.transactionService.isAnyTransactionsInCategory(
        categoryInfo.cat.id,
      );

    if (transactionsInCategory.success) {
      if (transactionsInCategory.transactions) {
        return {
          success: false,
          message: 'There are some transactions in category',
        };
      } else {
        await this.categoryRepo.delete({ id: categoryInfo.cat.id });
        return { success: true };
      }
    }

    return { success: false };
  }
}
