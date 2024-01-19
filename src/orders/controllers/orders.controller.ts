import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { OrdersService } from '../services/orders.service'
import { CreateOrderDto } from '../dto/create-order.dto'
import { UpdateOrderDto } from '../dto/update-order.dto'
import { ObjectId } from 'typeorm'
import { Roles, RolesAuthGuard } from '../../auth/guards/roles-auth.guard'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { UserExitsGuards } from '../guards/user-exits.guards'
import { ApiExcludeController } from '@nestjs/swagger'

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@UseInterceptors(CacheInterceptor)
@ApiExcludeController()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Roles('ADMIN')
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('isDeleted', new DefaultValuePipe(false), ParseBoolPipe)
    isDeleted: boolean = false,
  ) {
    limit = limit > 100 ? 100 : limit
    return this.ordersService.findAll({
      page,
      limit,
      isDeleted,
      route: 'http://localhost:3000/orders',
    })
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(@Param('id') id: ObjectId) {
    return this.ordersService.findOne(id)
  }

  @Get('user/:id')
  @Roles('ADMIN')
  async findOrdersByUser(@Param('id') id: string) {
    return this.ordersService.getOrdersByUser(id)
  }

  @Post()
  @Roles('ADMIN')
  @HttpCode(201)
  @UseGuards(UserExitsGuards)
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto)
  }

  @Put(':id')
  @UseGuards(UserExitsGuards)
  @Roles('ADMIN')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto)
  }

  @Delete(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  async remove(@Param('id') id: ObjectId) {
    return this.ordersService.remove(id)
  }
}
