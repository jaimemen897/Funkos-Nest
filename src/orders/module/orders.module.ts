import { Module } from '@nestjs/common'
import { OrdersService } from '../services/orders.service'
import { OrdersController } from '../controllers/orders.controller'
import { Order } from '../entities/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersMapper } from '../mapper/order.mapper'
import { Funko } from '../../funkos/entities/funko.entity'
import { CacheModule } from '@nestjs/cache-manager'
import { User } from '../../users/entities/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order], 'mongo'),
    TypeOrmModule.forFeature([Funko]),
    CacheModule.register(),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersMapper],
  exports: [OrdersService],
})
export class OrdersModule {}
