import { Module } from '@nestjs/common'
import { FunkosModule } from './funkos/module/funkos.module'

@Module({
  imports: [FunkosModule],
})
export class AppModule {}
