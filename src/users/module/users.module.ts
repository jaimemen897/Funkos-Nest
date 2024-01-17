import { Module } from '@nestjs/common'
import { UsersService } from '../services/users.service'
import { UsersController } from '../controller/users.controller'
import { OrdersService } from '../../orders/services/orders.service'
import { UsersMapper } from '../mappers/users.mapper'
import { BcryptService } from '../bcrypt.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { UserRole } from '../entities/user-role.entity'

@Module({
  controllers: [UsersController],
  providers: [UsersService, OrdersService, UsersMapper, BcryptService],
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  exports: [UsersService],
})
export class UsersModule {}
