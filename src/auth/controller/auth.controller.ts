import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { AuthService } from '../service/auth.service'
import { UserSingInDto } from '../dto/user-sing.in.dto'
import { UserSingUpDto } from '../dto/user-sing.up.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: UserSingInDto) {
    return this.authService.create(createAuthDto)
  }

  @Get()
  findAll() {
    return this.authService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UserSingUpDto) {
    return this.authService.update(+id, updateAuthDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id)
  }
}
