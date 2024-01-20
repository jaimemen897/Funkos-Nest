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
import { AuthModule } from './auth/module/auth.module'
import { UsersModule } from './users/module/users.module'

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(
      process.env.NODE_ENV === 'dev'
        ? { envFilePath: '.env' }
        : { envFilePath: '.env.prod' },
    ),
    FunkosModule,
    CategoryModule,
    StorageModule,
    DatabaseModule,
    OrdersModule,
    AuthModule,
    UsersModule,
  ],
  providers: [CategoryMapper, FunkosMapper],
})
export class AppModule {}
