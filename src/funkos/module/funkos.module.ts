import { Module } from '@nestjs/common'
import { FunkosService } from '../services/funkos.service'
import { FunkosController } from '../controllers/funkos.controller'
import { FunkosMapper } from '../mapper/funkos-mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from '../entities/funko.entity'
import { Category } from '../../category/entities/category.entity'
import { StorageService } from '../../storage/storage.service'
import { FunkoNotificationGateway } from '../../websockets/funko-notification.gateway'

@Module({
  controllers: [FunkosController],
  providers: [
    FunkosService,
    FunkosMapper,
    StorageService,
    FunkoNotificationGateway,
  ],
  imports: [TypeOrmModule.forFeature([Funko, Category])],
})
export class FunkosModule {}
