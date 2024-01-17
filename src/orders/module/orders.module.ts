import { Module } from '@nestjs/common'
import { OrdersService } from '../services/orders.service'
import { OrdersController } from '../controllers/orders.controller'
import { Order } from '../entities/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersMapper } from '../mapper/order.mapper'
import { Funko } from '../../funkos/entities/funko.entity'
import { UsersService } from '../../users/services/users.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order], 'mongo'),
    TypeOrmModule.forFeature([Funko]),
  ],
  controllers: [OrdersController],
  exports: [TypeOrmModule],
  providers: [OrdersService, OrdersMapper, UsersService],
})
export class OrdersModule {}
