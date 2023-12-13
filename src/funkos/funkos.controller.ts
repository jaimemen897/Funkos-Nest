import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FunkosService } from './funkos.service';
import { CreateFunkoDto } from './dto/create-funko.dto';
import { UpdateFunkoDto } from './dto/update-funko.dto';

@Controller('funkos')
export class FunkosController {
  constructor(private readonly funkosService: FunkosService) {}

  @Post()
  create(@Body() createFunkoDto: CreateFunkoDto) {
    return this.funkosService.create(createFunkoDto);
  }

  @Get()
  findAll() {
    return this.funkosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.funkosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFunkoDto: UpdateFunkoDto) {
    return this.funkosService.update(+id, updateFunkoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.funkosService.remove(+id);
  }
}
