import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common'
import { FunkosService } from '../services/funkos.service'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'

@Controller(`funkos`)
export class FunkosController {
  private logger = new Logger('FunkosController')

  constructor(private readonly funkosService: FunkosService) {}

  @Post()
  create(@Body() createFunkoDto: CreateFunkoDto) {
    this.logger.log('Creating a new funko')
    return this.funkosService.create(createFunkoDto)
  }

  @Get()
  findAll() {
    this.logger.log('Finding all funkos')
    return this.funkosService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Finding funko with id ${id}`)
    return this.funkosService.findOne(+id)
  }

  @Put(':id')
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    this.logger.log(`Updating funko with id ${id}`)
    return this.funkosService.update(+id, updateFunkoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    this.logger.log(`Deleting funko with id ${id}`)
    return this.funkosService.remove(+id)
  }
}
