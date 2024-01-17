import { Injectable } from '@nestjs/common'
import { UserSingInDto } from '../dto/user-sing.in.dto'
import { UserSingUpDto } from '../dto/user-sing.up.dto'

@Injectable()
export class AuthService {
  create(createAuthDto: UserSingInDto) {
    return 'This action adds a new auth'
  }

  findAll() {
    return `This action returns all auth`
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`
  }

  update(id: number, updateAuthDto: UserSingUpDto) {
    return `This action updates a #${id} auth`
  }

  remove(id: number) {
    return `This action removes a #${id} auth`
  }
}
