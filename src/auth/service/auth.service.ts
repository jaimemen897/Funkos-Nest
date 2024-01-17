import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { UsersService } from '../../users/services/users.service'
import { AuthMapper } from '../mappers/user.mapper'
import { JwtService } from '@nestjs/jwt'
import { UserSingUpDto } from '../dto/user-sing.up.dto'
import { UserSingInDto } from '../dto/user-sing.in.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly usersService: UsersService,
    private readonly authMapper: AuthMapper,
    private readonly jwtService: JwtService,
  ) {}

  async singUp(userSingUpDto: UserSingUpDto) {
    this.logger.log(`singUp: ${JSON.stringify(userSingUpDto)}`)
    const user = await this.usersService.create(
      this.authMapper.toCreateDto(userSingUpDto),
    )
    return this.getAccessToken(user.id)
  }

  async singIn(userSingInDto: UserSingInDto) {
    this.logger.log(`singIn: ${JSON.stringify(userSingInDto)}`)
    const user = await this.usersService.findByUsername(userSingInDto.username)
    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }
    const isValidPassword = await this.usersService.validatePassword(
      userSingInDto.password,
      user.password,
    )
    if (!isValidPassword) {
      throw new BadRequestException('Invalid credentials')
    }
    return this.getAccessToken(user.id)
  }

  async validateUser(id: number): Promise<any> {
    this.logger.log(`validateUser: ${id}`)
    return this.usersService.findOne(id)
  }

  private getAccessToken(userId: number) {
    this.logger.log(`getAccessToken: ${userId}`)
    try {
      const payload = { id: userId }
      return this.jwtService.sign(payload)
    } catch (error) {
      this.logger.error(error)
      throw new BadRequestException('Error generating access token')
    }
  }
}
