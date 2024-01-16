import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { Order } from '../entities/order.entity'
import { MongoRepository, ObjectId } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { OrdersMapper } from '../mapper/order.mapper'

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order, 'mongo')
    private readonly orderRepository: MongoRepository<Order>,
    private readonly orderMapper: OrdersMapper,
  ) {}

  async findAll() {
    return await this.orderRepository.find()
  }

  async findOne(id: ObjectId) {
    const order = await this.orderRepository.findOneBy({ _id: id })
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`)
    }
    return order
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = this.orderMapper.toEntity(createOrderDto)
    return await this.orderRepository.save(order)
  }

  async update(id: ObjectId, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.findOne(id)
    const updatedOrder = this.orderMapper.toEntity(updateOrderDto)
    updatedOrder._id = existingOrder._id
    return await this.orderRepository.save(updatedOrder)
  }

  async remove(id: ObjectId) {
    const order = await this.findOne(id)
    return await this.orderRepository.remove(order)
  }

  //clientExists(idClient)
  //getOrderByClient(idClient)
  //checkOrder(order)
  //reserveStock(order)
  //returnStock(order)
}
