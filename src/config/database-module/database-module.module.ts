import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import * as process from 'process'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'mongodb',
        uri: `mongodb://${process.env.DATABASE_USER}:${
          process.env.DATABASE_PASSWORD
        }@${process.env.MONGO_HOST}:${process.env.MONGO_PORT || 27017}/${
          process.env.MONGO_DATABASE
        }`,
        retryAttempts: 5,
        connectionFactory: (connection) => {
          Logger.log(
            `MongoDB readyState: ${connection.readyState}`,
            'DatabaseModule',
          )
          return connection
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT) || 5432,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true,
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabaseModuleModule {}
