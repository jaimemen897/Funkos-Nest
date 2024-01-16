import { Injectable } from '@nestjs/common'
import { CreateOrderDto } from '../dto/create-order.dto'
import { Order } from '../entities/order.entity'
import { plainToClass } from 'class-transformer'
import { UpdateOrderDto } from '../dto/update-order.dto'

@Injectable()
export class OrdersMapper {
  toEntity(createOrderDto: CreateOrderDto | UpdateOrderDto): Order {
    return plainToClass(Order, createOrderDto)
  }
}
