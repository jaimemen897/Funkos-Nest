import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FunkosModule } from './funkos/funkos.module';
import { FunkosControllerController } from './funkos-controller/funkos-controller.controller';

@Module({
  imports: [FunkosModule],
  controllers: [AppController, FunkosControllerController],
  providers: [AppService],
})
export class AppModule {}
