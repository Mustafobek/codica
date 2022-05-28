import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryService } from 'src/shared/services/category.service';

@Controller('v1/api/category')
@ApiTags('Category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  @ApiOperation({ description: 'получить все' })
  async getAllCats() {
    try {
      return this.categoryService.getAllCategories();
    } catch (error) {
      return { success: false };
    }
  }

  @Get(':id')
  @ApiOperation({ description: 'получить один' })
  async getCategory(@Param('id') id?: number, @Body('name') name?: string) {
    try {
      if (id) {
        return this.categoryService.getCategoryById(id);
      } else if (name) {
        return this.categoryService.getCategoryByName(name);
      } else {
        return {
          success: false,
          message: 'provide either id or name of category',
        };
      }
    } catch (error) {
      return { success: false };
    }
  }

  @Post('')
  @ApiOperation({ description: 'создать' })
  async createCategory(@Body('name') name: string) {
    try {
      return this.categoryService.createCategory(name);
    } catch (error) {
      return { success: false };
    }
  }

  @Patch(':id')
  @ApiOperation({ description: 'отредактировать' })
  async updateCategory(@Param('id') id: number, @Body('name') name: string) {
    try {
      return this.categoryService.updateCategory(id, name)
    } catch (error) {
      return { success: false };
    }
  }

  @Delete(':id')
  @ApiOperation({ description: 'удалить' })
  async deleteCategory(@Param('id') id: number) {
    try {
      return this.categoryService.deleteCategory(id)
    } catch (error) {
      return { success: false };
    }
  }
}
