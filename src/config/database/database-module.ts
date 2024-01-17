import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Funko } from '../../funkos/entities/funko.entity'
import { Category } from '../../category/entities/category.entity'
import * as process from 'process'
import { Order } from '../../orders/entities/order.entity'

@Module({
  imports: [
    ConfigModule,
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
  ],
  providers: [],
  exports: [
    TypeOrmModule.forFeature([Funko, Category]),
    TypeOrmModule.forFeature([Order]),
  ],
})
export class DatabaseModule {}
