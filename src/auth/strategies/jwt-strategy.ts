import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from '../../users/entities/user.entity'
import { AuthService } from '../service/auth.service'

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        process.env.TOKEN_SECRET || 'este-es-el-secret-key',
        'utf-8',
      ).toString('base64'),
    })
  }

  // Si se valida obtenemos el role
  async validate(payload: User) {
    const id = payload.id
    return await this.authService.validateUser(id)
  }
}
