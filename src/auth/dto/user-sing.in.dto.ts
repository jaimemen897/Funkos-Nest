import { IsNotEmpty, IsString } from 'class-validator'

export class UserSingInDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string
}
