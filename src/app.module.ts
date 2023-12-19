import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/module/funkos.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryModule } from './category/module/category.module'
import { CategoryMapper } from './category/mapper/category-mapper'
import { FunkosMapper } from './funkos/mapper/funkos-mapper'

@Module({
  imports: [
    FunkosModule,
    CategoryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'database',
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
      synchronize: true,
    }),
  ],
  providers: [CategoryMapper, FunkosMapper],
})
export class AppModule {}
