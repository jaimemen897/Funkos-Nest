import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Funko } from '../../funkos/entities/funko.entity'
import { Category } from '../../category/entities/category.entity'
import { Order } from '../../orders/entities/order.entity'
import * as process from 'process'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        name: 'postgres',
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        entities: [Funko, Category],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        name: 'mongo', // Agrega un nombre a la conexión
        type: 'mongodb',
        uri: `mongodb://${process.env.MONGO_USER}:${
          process.env.MONGO_PASSWORD
        }@${process.env.MONGO_HOST}:${process.env.MONGO_PORT || 27017}/${
          process.env.MONGO_DB
        }`,
        retryAttempts: 5,
        entities: [Order],
        connectionFactory: (connection) => {
          Logger.log(
            `MongoDB readyState: ${connection.readyState}`,
            'DatabaseModule',
          )
          return connection
        },
      }),
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
