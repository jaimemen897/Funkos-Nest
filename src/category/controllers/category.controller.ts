import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CategoryService } from '../services/category.service'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { Roles, RolesAuthGuard } from '../../auth/guards/roles-auth.guard'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { ApiExcludeController } from '@nestjs/swagger'

@Controller('category')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@ApiExcludeController()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @CacheKey('all_categories')
  @CacheTTL(60)
  @Roles('USER')
  findAll(@Paginate() query: PaginateQuery) {
    return this.categoryService.findAll(query)
  }

  @Get(':id')
  @CacheKey('one_category')
  @CacheTTL(60)
  @Roles('USER')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto)
  }

  @Put(':id')
  @HttpCode(200)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id)
  }
}
