import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { OrdersService } from '../services/orders.service'

@Injectable()
export class UserExitsGuards implements CanActivate {
  1

  constructor(private readonly ordersService: OrdersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const body = request.body
    const idUser = body.idClient

    if (!idUser) {
      throw new BadRequestException('El id del user es obligatorio')
    }

    if (isNaN(idUser)) {
      throw new BadRequestException('El id del user no es válido')
    }

    return this.ordersService.userExists(idUser).then((exists) => {
      if (!exists) {
        throw new BadRequestException('El ID del user no existe en el sistema')
      }
      return true
    })
  }
}
