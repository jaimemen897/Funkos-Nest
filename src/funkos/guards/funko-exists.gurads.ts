import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { FunkosService } from '../services/funkos.service'
import { Observable } from 'rxjs'

@Injectable()
export class FunkoExistsGuard implements CanActivate {
  constructor(private readonly funkosService: FunkosService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const funkoId = parseInt(request.params.id, 10)

    if (isNaN(funkoId)) {
      throw new BadRequestException('El id del funko no es válido')
    }
    return this.funkosService.findOne(funkoId).then((exists) => {
      if (!exists) {
        throw new BadRequestException('El ID del funko no existe')
      }
      return true
    })
  }
}
