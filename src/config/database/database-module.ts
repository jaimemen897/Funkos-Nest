import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Funko } from '../../funkos/entities/funko.entity'
import { Category } from '../../category/entities/category.entity'
import * as process from 'process'
import { Order } from '../../orders/entities/order.entity'
import { User } from '../../users/entities/user.entity'
import { UserRole } from '../../users/entities/user-role.entity'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [Funko, Category, User, UserRole],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRoot({
      name: 'mongo',
      type: 'mongodb',
      host: process.env.MONGO_HOST || 'localhost',
      username: process.env.MONGO_USER || 'funko',
      password: process.env.MONGO_PASSWORD || 'funko',
      port: parseInt(process.env.MONGO_PORT) || 27017,
      database: process.env.MONGO_DB || 'database',
      retryAttempts: 5,
      synchronize: true,
      entities: [Order],
      logging: 'all',
    }),
  ],
  providers: [],
  exports: [
    TypeOrmModule.forFeature([Funko, Category, User, UserRole]),
    TypeOrmModule.forFeature([Order]),
  ],
})
export class DatabaseModule {}
