import { Module } from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { FunkosController } from './funkos.controller'

@Module({
  controllers: [FunkosController],
  providers: [FunkosService],
})
export class FunkosModule {}
