import { Module } from '@nestjs/common'
import { CategoryService } from '../services/category.service'
import { CategoryController } from '../controllers/category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from '../entities/category.entity'
import { CategoryMapper } from '../mapper/category-mapper'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryMapper],
  imports: [TypeOrmModule.forFeature([Category])],
})
export class CategoryModule {}
