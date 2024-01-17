import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/module/funkos.module'
import { CategoryModule } from './category/module/category.module'
import { CategoryMapper } from './category/mapper/category-mapper'
import { FunkosMapper } from './funkos/mapper/funkos-mapper'
import { StorageModule } from './storage/storage.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { OrdersModule } from './orders/module/orders.module'
import { DatabaseModule } from './config/database/database-module'

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    FunkosModule,
    CategoryModule,
    StorageModule,
    DatabaseModule,
    OrdersModule,
  ],
  providers: [CategoryMapper, FunkosMapper],
})
export class AppModule {}
