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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FunkosService } from '../services/funkos.service'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FunkoExistsGuard } from '../guards/funko-exists.gurads'
import { extname, parse } from 'path'
import { diskStorage } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import { Paginate, Paginated, PaginateQuery } from 'nestjs-paginate'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { Roles, RolesAuthGuard } from '../../auth/guards/roles-auth.guard'

@Controller(`funkos`)
@UseInterceptors(CacheInterceptor)
@ApiTags('funkos')
export class FunkosController {
  private logger = new Logger('FunkosController')

  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  @CacheKey('all_funkos')
  @CacheTTL(60)
  @ApiResponse({
    status: 200,
    description: 'The records has been successfully fetched.',
    type: Paginated<ResponseFunkoDto[]>,
  })
  @ApiQuery({
    description: 'Filtro por limite por pagina',
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro por pagina',
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    description: 'Filtro de ordenación: campo:ASC|DESC',
    name: 'sortBy',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de busqueda: filter.campo = $eq:valor',
    name: 'filter',
    required: false,
    type: String,
  })
  @ApiQuery({
    description: 'Filtro de busqueda: search = valor',
    name: 'search',
    required: false,
    type: String,
  })
  findAll(@Paginate() query: PaginateQuery) {
    this.logger.log('Finding all funkos')
    return this.funkosService.findAll(query)
  }

  @Get(':id')
  @CacheKey('one_funko')
  @CacheTTL(60)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully fetched.',
    type: ResponseFunkoDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Filtro por id',
  })
  @ApiNotFoundResponse({
    description: 'Funko not found',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`Finding funko with id ${id}`)
    return this.funkosService.findOne(+id)
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: ResponseFunkoDto,
  })
  @ApiBody({
    type: CreateFunkoDto,
    description: 'Funko data',
  })
  @ApiBadRequestResponse({
    description:
      'El algunos de los campos no es válido según la especificación del DTO',
  })
  @ApiBadRequestResponse({
    description: 'La categoría no existe o no es válida',
  })
  create(@Body() createFunkoDto: CreateFunkoDto) {
    this.logger.log('Creating a new funko')
    return this.funkosService.create(createFunkoDto)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ResponseFunkoDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Filtro por id',
  })
  @ApiBody({
    type: UpdateFunkoDto,
    description: 'Funko data',
  })
  @ApiNotFoundResponse({
    description: 'Funko not found',
  })
  @ApiBadRequestResponse({
    description:
      'El algunos de los campos no es válido según la especificación del DTO',
  })
  @ApiBadRequestResponse({
    description: 'La categoría no existe o no es válida',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    this.logger.log(`Updating funko with id ${id}`)
    return this.funkosService.update(+id, updateFunkoDto)
  }

  @Patch('imagen/:id')
  @UseGuards(FunkoExistsGuard)
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: ResponseFunkoDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Filtro por id',
  })
  @ApiBody({
    type: UpdateFunkoDto,
    description: 'Funko data',
  })
  @ApiNotFoundResponse({
    description: 'Funko not found',
  })
  @ApiBadRequestResponse({
    description:
      'El algunos de los campos no es válido según la especificación del DTO',
  })
  @ApiBadRequestResponse({
    description: 'La categoría no existe o no es válida',
  })
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
  @UseGuards(JwtAuthGuard, RolesAuthGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Filtro por id',
  })
  @ApiNotFoundResponse({
    description: 'Funko not found',
  })
  @ApiBadRequestResponse({
    description: 'El id no es válido',
  })
  remove(@Param('id') id: number) {
    this.logger.log(`Deleting funko with id ${id}`)
    return this.funkosService.remove(+id)
  }
}
