import { Injectable } from '@nestjs/common'
import { UserSingUpDto } from '../dto/user-sing.up.dto'
import { Role } from '../../users/entities/user-role.entity'
import { CreateUserDto } from '../../users/dto/create-user.dto'

@Injectable()
export class AuthMapper {
  toCreateDto(userSignUpDto: UserSingUpDto): CreateUserDto {
    const userCreateDto = new CreateUserDto()
    userCreateDto.nombre = userSignUpDto.name
    userCreateDto.apellidos = userSignUpDto.surnames
    userCreateDto.username = userSignUpDto.username
    userCreateDto.email = userSignUpDto.email
    userCreateDto.password = userSignUpDto.password
    userCreateDto.roles = [Role.USER]
    return userCreateDto
  }
}
