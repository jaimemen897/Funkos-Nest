import { Body, Controller, Logger, Post } from '@nestjs/common'
import { AuthService } from '../service/auth.service'
import { UserSingInDto } from '../dto/user-sing.in.dto'
import { UserSingUpDto } from '../dto/user-sing.up.dto'

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)

  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  async singUp(@Body() userSingUpDto: UserSingUpDto) {
    this.logger.log('singUp')
    return await this.authService.singUp(userSingUpDto)
  }

  @Post('singin')
  async singIn(@Body() userSingInDto: UserSingInDto) {
    this.logger.log('singIn')
    return await this.authService.singIn(userSingInDto)
  }
}
