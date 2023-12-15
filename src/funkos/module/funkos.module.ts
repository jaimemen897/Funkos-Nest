import { Module } from '@nestjs/common'
import { FunkosService } from '../services/funkos.service'
import { FunkosController } from '../controllers/funkos.controller'
import { FunkosMapper } from '../mapper/funkos-mapper'

@Module({
  controllers: [FunkosController],
  providers: [FunkosService, FunkosMapper],
})
export class FunkosModule {}
