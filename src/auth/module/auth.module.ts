import { Module } from '@nestjs/common'
import { AuthService } from '../service/auth.service'
import { AuthController } from '../controller/auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../../users/module/users.module'
import { AuthMapper } from '../mappers/user.mapper'
import { JwtAuthStrategy } from '../strategies/jwt-strategy'

@Module({
  imports: [
    JwtModule.register({
      secret: Buffer.from(
        process.env.JWT_SECRET_KEY || 'este-es-el-secret-key',
        'utf-8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.TOKEN_EXPIRES) || 3600,
        algorithm: 'HS512',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper, JwtAuthStrategy],
})
export class AuthModule {}
