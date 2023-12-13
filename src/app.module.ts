import { Module } from '@nestjs/common'
import { FunkosService } from './funkos/funkos.service'
import { FunkosModule } from './funkos/funkos.module'
import { FunkosController } from './funkos/funkos.controller'

@Module({
  imports: [FunkosModule],
  controllers: [FunkosController],
  providers: [FunkosService],
})
export class AppModule {}
