import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/module/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryModule } from './category/module/category.module'
import { CategoryMapper } from './category/mapper/category-mapper'

@Module({
  imports: [
    FunkosModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'adminPassword123',
      database: 'NEST_DB',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),
    CategoryModule,
  ],
  providers: [CategoryMapper],
})
export class AppModule {}
