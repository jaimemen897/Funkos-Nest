import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { Order } from '../entities/order.entity'
import { ObjectId, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { OrdersMapper } from '../mapper/order.mapper'
import { Funko } from '../../funkos/entities/funko.entity'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { PaginationInterface } from '../interfaces/paginationInterface'
import { User } from '../../users/entities/user.entity'

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(
    @InjectRepository(Order, 'mongo')
    private readonly orderRepository: Repository<Order>,
    private readonly orderMapper: OrdersMapper,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
  ) {}

  async findAll(options: PaginationInterface): Promise<Pagination<Order>> {
    return paginate<Order>(this.orderRepository, options, {
      where: { isDeleted: options.isDeleted },
    })
  }

  async findOne(id: ObjectId) {
    this.logger.log(`Finding order ${id}`)
    const order = await this.orderRepository.findOneBy({ _id: id })
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`)
    }
    return order
  }

  async create(createOrderDto: CreateOrderDto) {
    this.logger.log(`Creating order ${createOrderDto}`)
    console.log(createOrderDto)

    const orderToBeSaved = this.orderMapper.toEntity(createOrderDto)

    await this.checkOrder(orderToBeSaved)

    const orderToSave = await this.reserveStockOrders(orderToBeSaved)

    orderToSave.createdAt = new Date()
    orderToSave.updatedAt = new Date()

    return await this.orderRepository.save(orderToSave)
  }

  async update(id: ObjectId, updateOrderDto: UpdateOrderDto) {
    this.logger.log(`Updating order ${id}`)
    const orderToUpdate = await this.orderRepository.findOneBy({ _id: id })
    if (!orderToUpdate) {
      throw new NotFoundException(`Order #${id} not found`)
    }
    const orderToBeSaved = this.orderMapper.toEntity(updateOrderDto)

    await this.returnStockOrders(orderToUpdate)
    await this.checkOrder(orderToBeSaved)
    const orderToSave = await this.reserveStockOrders(orderToBeSaved)

    orderToSave.updatedAt = new Date()

    return await this.orderRepository.save(orderToSave)
  }

  async remove(id: ObjectId) {
    this.logger.log(`Removing order ${id}`)

    const orderToDelete = await this.orderRepository.findOneBy({ _id: id })
    if (!orderToDelete) {
      throw new NotFoundException(`Order #${id} not found`)
    }
    await this.returnStockOrders(orderToDelete)
    await this.orderRepository.delete({ _id: id })
  }

  async userExists(idClient: number) {
    this.logger.log(`Checking if user ${idClient} exists`)
    const user = await this.userRepository.findOneBy({ id: idClient })
    return !!user
  }

  async getOrdersByUser(idUser: string): Promise<Order[]> {
    this.logger.log(`Buscando pedidos por usuario ${idUser}`)
    return await this.orderRepository.find({ where: { idClient: idUser } })
  }

  private async checkOrder(order: Order) {
    this.logger.log(`Checking order ${order._id}`)

    if (!order.orderLines || order.orderLines.length === 0) {
      throw new BadRequestException('Order must have at least one order line')
    }

    for (const orderLine of order.orderLines) {
      const product = await this.funkoRepository.findOneBy({
        id: orderLine.idFunko,
      })
      if (!product) {
        throw new BadRequestException(
          `Funko ${orderLine.idFunko} does not exist`,
        )
      }
      if (product.stock < orderLine.quantity && orderLine.quantity > 0) {
        throw new BadRequestException(
          `Funko ${orderLine.idFunko} does not have enough stock`,
        )
      }
      if (product.price != orderLine.price) {
        throw new BadRequestException(
          `Funko ${orderLine.idFunko} price has changed`,
        )
      }
    }
  }

  private async reserveStockOrders(order: Order): Promise<Order> {
    this.logger.log(`Reserving stock for order ${order._id}`)

    if (!order.orderLines || order.orderLines.length === 0) {
      throw new BadRequestException('Order must have at least one order line')
    }

    for (const orderLine of order.orderLines) {
      const product = await this.funkoRepository.findOneBy({
        id: orderLine.idFunko,
      })
      product.stock -= orderLine.quantity
      await this.funkoRepository.save(product)
      orderLine.total = orderLine.quantity * orderLine.price
    }

    order.total = order.orderLines.reduce(
      (sum, orderLine) => sum + orderLine.quantity * orderLine.price,
      0,
    )

    order.totalItems = order.orderLines.reduce(
      (sum, orderLine) => sum + orderLine.quantity,
      0,
    )

    return order
  }

  private async returnStockOrders(order: Order): Promise<Order> {
    this.logger.log(`Returning stock for order ${order._id}`)

    if (order.orderLines) {
      for (const orderLine of order.orderLines) {
        const product = await this.funkoRepository.findOneBy({
          id: orderLine.idFunko,
        })
        product.stock += orderLine.quantity
        await this.funkoRepository.save(product)
      }
    }
    return order
  }
}
