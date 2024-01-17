import { Module } from '@nestjs/common'
import { OrdersService } from '../services/orders.service'
import { OrdersController } from '../controllers/orders.controller'
import { Order } from '../entities/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrdersMapper } from '../mapper/order.mapper'

@Module({
  imports: [TypeOrmModule.forFeature([Order], 'mongo')],
  controllers: [OrdersController],
  exports: [TypeOrmModule],
  providers: [OrdersService, OrdersMapper],
})
export class OrdersModule {}
