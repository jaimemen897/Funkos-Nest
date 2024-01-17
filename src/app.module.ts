import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/module/funkos.module'
import { CategoryModule } from './category/module/category.module'
import { CategoryMapper } from './category/mapper/category-mapper'
import { FunkosMapper } from './funkos/mapper/funkos-mapper'
import { StorageModule } from './storage/storage.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './config/database/database-module'
import { OrdersModule } from './orders/module/orders.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from './funkos/entities/funko.entity'
import { Category } from './category/entities/category.entity'
import { Order } from './orders/entities/order.entity'

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    FunkosModule,
    CategoryModule,
    StorageModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [Funko, Category],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRoot({
      name: 'mongo',
      type: 'mongodb',
      username: 'funko',
      password: 'funko',
      port: 27017,
      database: 'database',
      retryAttempts: 5,
      synchronize: true,
      entities: [Order],
      logging: 'all',
    }),
    OrdersModule,
  ],
  providers: [CategoryMapper, FunkosMapper],
})
export class AppModule {}
