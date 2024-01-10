import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import { CategoryService } from '../services/category.service'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@Controller('category')
@UseInterceptors(CacheInterceptor)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Get()
  @CacheKey('all_categories')
  @CacheTTL(60)
  findAll() {
    return this.categoryService.findAll()
  }

  @Get(':id')
  @CacheKey('one_category')
  @CacheTTL(60)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id)
  }

  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id)
  }
}
