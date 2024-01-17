import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from '../services/users.service'
import { CacheInterceptor } from '@nestjs/cache-manager'
import { ApiExcludeController } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../../auth/guards/roles-auth.guard'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { CreateOrderDto } from '../../orders/dto/create-order.dto'
import { UpdateOrderDto } from '../../orders/dto/update-order.dto'
import { IdValidatePipe } from '../../orders/pipes/id-validate.pipe'
import { ObjectId } from 'typeorm'

@Controller('users')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard, RolesAuthGuard)
@ApiExcludeController()
export class UsersController {
  private readonly logger = new Logger(UsersController.name)

  constructor(private readonly usersService: UsersService) {}

  /// GESTION, SOLO ADMINISTRADOR

  @Get()
  @Roles('ADMIN')
  async findAll() {
    this.logger.log('findAll')
    return await this.usersService.findAll()
  }

  @Get(':id')
  @Roles('ADMIN')
  async findOne(id: number) {
    this.logger.log(`findOne: ${id}`)
    return await this.usersService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('create')
    return await this.usersService.create(createUserDto)
  }

  @Put(':id')
  @Roles('ADMIN')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`update: ${id}`)
    return await this.usersService.update(id, updateUserDto, true)
  }

  // ME/PROFILE, CUALQUIER USUARIO AUTENTICADO
  @Get('me/profile')
  @Roles('USER')
  async getProfile(@Req() request: any) {
    return request.user
  }

  @Delete('me/profile')
  @HttpCode(204)
  @Roles('USER')
  async deleteProfile(@Req() request: any) {
    return await this.usersService.remove(request.user.id)
  }

  @Put('me/profile')
  @Roles('USER')
  async updateProfile(
    @Req() request: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(request.user.id, updateUserDto, false)
  }

  // ME/PEDIDOS, CUALQUIER USUARIO AUTENTICADO siempre y cuando el id del usuario coincida con el id del order
  @Get('me/orders')
  async getOrders(@Req() request: any) {
    return await this.usersService.getOrders(request.user.id)
  }

  @Get('me/orders/:id')
  async getOrder(
    @Req() request: any,
    @Param('id', IdValidatePipe) id: ObjectId,
  ) {
    return await this.usersService.getOrder(request.user.id, id)
  }

  @Post('me/orders')
  @HttpCode(201)
  @Roles('USER')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request: any,
  ) {
    this.logger.log(`Creando order ${JSON.stringify(createOrderDto)}`)
    return await this.usersService.createOrder(createOrderDto, request.user.id)
  }

  @Put('me/orders/:id')
  @Roles('USER')
  async updateOrder(
    @Param('id', IdValidatePipe) id: ObjectId,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() request: any,
  ) {
    this.logger.log(
      `Actualizando order con id ${id} y ${JSON.stringify(updateOrderDto)}`,
    )
    return await this.usersService.updateOrder(
      id,
      updateOrderDto,
      request.user.id,
    )
  }

  @Delete('me/orders/:id')
  @HttpCode(204)
  @Roles('USER')
  async removeOrder(
    @Param('id', IdValidatePipe) id: ObjectId,
    @Req() request: any,
  ) {
    this.logger.log(`Eliminando order con id ${id}`)
    await this.usersService.removeOrder(id, request.user.id)
  }
}
