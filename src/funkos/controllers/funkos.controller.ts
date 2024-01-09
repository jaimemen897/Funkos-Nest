import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Request } from 'express'
import { FunkosService } from '../services/funkos.service'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FunkoExistsGuard } from '../guards/funko-exists.gurads'
import { extname, parse } from 'path'
import { diskStorage } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express'

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

  @Patch('imagen/:id')
  @UseGuards(FunkoExistsGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.UPLOADS_FOLDER || './storage-dir',
        filename: (req, file, cb) => {
          const { name } = parse(file.originalname)
          const fileName = `${Date.now()}_${name.replace(/\s/g, '')}`
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/jpg',
        ]
        const maxFileSize = 1024 * 1024 // 1 megabyte
        if (!allowedMimes.includes(file.mimetype)) {
          cb(
            new BadRequestException(
              'Fichero no soportado. No es del tipo imagen válido',
            ),
            false,
          )
        } else if (file.size > maxFileSize) {
          cb(
            new BadRequestException(
              'El tamaño del archivo no puede ser mayor a 1 megabyte.',
            ),
            false,
          )
        } else {
          cb(null, true)
        }
      },
    }),
  )
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log(`Actualizando imagen al producto con ${id}:  ${file}`)

    return await this.funkosService.updateImage(id, file)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    this.logger.log(`Deleting funko with id ${id}`)
    return this.funkosService.remove(+id)
  }
}
