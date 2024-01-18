import { Module } from '@nestjs/common'
import { UsersService } from '../services/users.service'
import { UsersController } from '../controller/users.controller'
import { UsersMapper } from '../mappers/users.mapper'
import { BcryptService } from '../bcrypt.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { UserRole } from '../entities/user-role.entity'
import { CacheModule } from '@nestjs/cache-manager'
import { OrdersModule } from '../../orders/module/orders.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserRole]),
    CacheModule.register(),
    OrdersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersMapper, BcryptService],
  exports: [UsersService],
})
export class UsersModule {}
