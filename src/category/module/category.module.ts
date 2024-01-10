import { Module } from '@nestjs/common'
import { CategoryService } from '../services/category.service'
import { CategoryController } from '../controllers/category.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from '../entities/category.entity'
import { CategoryMapper } from '../mapper/category-mapper'
import { NotificationGateway } from '../../websockets/notification.gateway'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryMapper, NotificationGateway],
  imports: [TypeOrmModule.forFeature([Category]), CacheModule.register()],
})
export class CategoryModule {}
