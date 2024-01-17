import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User } from '../entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectId, Repository } from 'typeorm'
import { Role, UserRole } from '../entities/user-role.entity'
import { OrdersService } from '../../orders/services/orders.service'
import { UsersMapper } from '../mappers/users.mapper'
import { BcryptService } from '../bcrypt.service'
import { CreateOrderDto } from '../../orders/dto/create-order.dto'
import { UpdateOrderDto } from '../../orders/dto/update-order.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly orderService: OrdersService,
    private readonly userMapper: UsersMapper,
    private readonly bcryptService: BcryptService,
  ) {}

  async findAll() {
    this.logger.log('findAll')
    return (await this.userRepository.find()).map((user) =>
      this.userMapper.toResponseDto(user),
    )
  }

  async findOne(id: number) {
    this.logger.log('findOne')
    return this.userMapper.toResponseDto(
      await this.userRepository.findOneBy({ id }),
    )
  }

  async create(createUserDto: CreateUserDto) {
    this.logger.log('create')
    const existingUser = await Promise.all([
      this.findByUsername(createUserDto.username),
      this.findByEmail(createUserDto.email),
    ])
    if (existingUser[0]) {
      throw new BadRequestException('Username already exists')
    }
    if (existingUser[1]) {
      throw new BadRequestException('Email already exists')
    }
    const hashPassword = await this.bcryptService.hash(createUserDto.password)

    const user = this.userMapper.toEntity(createUserDto)
    user.password = hashPassword
    const userSaved = await this.userRepository.save(user)
    const roles = createUserDto.roles || [Role.USER]
    const userRoles = roles.map((role) => ({
      user: userSaved,
      role: Role[role],
    }))
    const savedUserRoles = await this.userRoleRepository.save(userRoles)
    return this.userMapper.toResponseDtoWithRoles(user, savedUserRoles)
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    updateRoles: boolean = false,
  ) {
    this.logger.log('update')

    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new BadRequestException('User not found')
    }
    if (user.username) {
      const existingUser = await this.findByUsername(updateUserDto.username)
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Username already exists')
      }
    }
    if (user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email)
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email already exists')
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await this.bcryptService.hash(
        updateUserDto.password,
      )
    }

    const rolesBackup = [...user.roles]
    Object.assign(user, updateUserDto)

    if (updateRoles) {
      for (const role of rolesBackup) {
        await this.userRoleRepository.remove(role)
      }
      const roles = updateUserDto.roles || [Role.USER]
      const userRoles = roles.map((role) => ({
        usuario: user,
        role: Role[role],
      }))
      user.roles = await this.userRoleRepository.save(userRoles)
    } else {
      user.roles = rolesBackup
    }
    const updatedUser = await this.userRepository.save(user)
    return this.userMapper.toResponseDto(updatedUser)
  }

  async remove(id: number) {
    return `This action removes a #${id} user`
  }

  validateRoles(roles: string[]) {
    return roles.every((role) => Role[role])
  }

  async validatePassword(password: string, hash: string) {
    return await this.bcryptService.isMatch(password, hash)
  }

  async findByUsername(username: string) {
    this.logger.log('findByUsername')
    return this.userRepository.findOneBy({ username })
  }

  async findByEmail(email: string) {
    this.logger.log('findByEmail')
    return this.userRepository.findOneBy({ email })
  }

  async getOrders(id: string) {
    return await this.orderService.getOrderByUser(id)
  }

  async getOrder(id: string, idOrder: ObjectId) {
    const order = await this.orderService.findOne(idOrder)
    if (order.idClient !== id) {
      throw new ForbiddenException('You are not allowed to see this order')
    }
    return order
  }

  async createOrder(createOrderDto: CreateOrderDto, userId: string) {
    this.logger.log(`Creating order ${createOrderDto}`)
    if (createOrderDto.idClient != userId) {
      throw new BadRequestException(
        'Product idUser must be the same as the authenticated user',
      )
    }
    return await this.orderService.create(createOrderDto)
  }

  async updateOrder(
    id: ObjectId,
    updateOrderDto: UpdateOrderDto,
    userId: string,
  ) {
    this.logger.log(`Updating order ${id}`)
    if (updateOrderDto.idClient != userId) {
      throw new BadRequestException(
        'Product idUser must be the same as the authenticated user',
      )
    }
    const order = await this.orderService.findOne(id)
    if (order.idClient !== userId) {
      throw new ForbiddenException('You are not allowed to update this order')
    }
    return await this.orderService.update(id, updateOrderDto)
  }

  async removeOrder(id: ObjectId, userId: string) {
    this.logger.log(`Removing order ${id}`)
    const order = await this.orderService.findOne(id)
    if (order.idClient !== userId) {
      throw new ForbiddenException('You are not allowed to remove this order')
    }
    return await this.orderService.remove(id)
  }
}
