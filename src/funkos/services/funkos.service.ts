import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FunkosMapper } from '../mapper/funkos-mapper'
import { Funko } from '../entities/funko.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { Repository } from 'typeorm'
import { Category } from '../../category/entities/category.entity'
import { StorageService } from '../../storage/storage.service'

@Injectable()
export class FunkosService {
  private logger = new Logger('FunkosService')

  constructor(
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    private readonly funkoMapper: FunkosMapper,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly storageService: StorageService,
  ) {}

  async findAll() {
    this.logger.log('Finding all funkos')
    return this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')
      .getMany()
      .then((funkos) => {
        return funkos.map((funko) => {
          return this.funkoMapper.mapToResponseDto(funko)
        })
      })
  }

  async findOne(id: number) {
    this.logger.log(`Finding funko with id ${id}`)
    const funko = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')
      .where('funko.id = :id', { id })
      .getOne()
    if (funko) {
      return this.funkoMapper.mapToResponseDto(funko)
    } else {
      throw new NotFoundException(`Funko #${id} not found`)
    }
  }

  async checkCategoria(name: string) {
    this.logger.log(`Finding category with name ${name}`)
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', {
        name: name,
      })
      .andWhere('category.isDeleted = false')
      .getOne()
    if (category) {
      return category
    } else {
      throw new BadRequestException(`Category ${name} not found`)
    }
  }

  async create(createFunkoDto: CreateFunkoDto) {
    this.logger.log('Creating a new funko')
    const categoria = await this.checkCategoria(createFunkoDto.category)
    const funkoToCreate = this.funkoMapper.mapToEntity(
      createFunkoDto,
      categoria,
    )
    const funkoCreated = await this.funkoRepository.save(funkoToCreate)
    return this.funkoMapper.mapToResponseDto(funkoCreated)
  }

  async update(id: number, updateFunkoDto: UpdateFunkoDto) {
    this.logger.log(`Updating funko with id ${id}`)
    const funkoToUpdate = await this.findOne(id)
    let category: Category
    if (updateFunkoDto.category) {
      category = await this.checkCategoria(updateFunkoDto.category)
    } else {
      category = await this.checkCategoria(funkoToUpdate.category)
    }
    const funkoUpdated = await this.funkoRepository.save({
      ...funkoToUpdate,
      ...updateFunkoDto,
      category,
    })
    return this.funkoMapper.mapToResponseDto(funkoUpdated)
  }

  async updateImage(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean = false,
  ) {
    this.logger.log(`Updating funko image with id ${id}`)
    const funkoToUpdate = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')
      .where('funko.id = :id', { id })
      .getOne()
    if (funkoToUpdate.image !== Funko.IMAGE_DEFAULT) {
      this.logger.log(`Eliminando imagen antigua ${funkoToUpdate.image}`)
      let imagePath = funkoToUpdate.image
      if (withUrl) {
        imagePath = this.storageService.getFileNameWithoutUrl(
          funkoToUpdate.image,
        )
      }
      try {
        this.storageService.removeFile(imagePath)
      } catch (error) {
        this.logger.error(error)
      }
    }

    if (!file) {
      throw new BadRequestException('File is required')
    }

    let filePath: string

    if (withUrl) {
      this.logger.log(`Generando url para ${file.filename}`)
      filePath = `${req.protocol}://${req.get('host')}/api/storage/${
        file.filename
      }`
    } else {
      filePath = file.filename
    }

    funkoToUpdate.image = filePath
    const funkoUpdated = await this.funkoRepository.save(funkoToUpdate)
    return this.funkoMapper.mapToResponseDto(funkoUpdated)
  }

  async remove(id: number) {
    this.logger.log(`Deleting funko with id ${id}`)
    const funkoToRemove = await this.funkoRepository.findOneBy({ id })
    if (!funkoToRemove) {
      throw new NotFoundException(`Funko #${id} not found`)
    }
    if (funkoToRemove.image !== Funko.IMAGE_DEFAULT) {
      this.logger.log(`Eliminando imagen antigua ${funkoToRemove.image}`)
      try {
        this.storageService.removeFile(funkoToRemove.image)
      } catch (error) {
        this.logger.error(error)
      }
    }
    const funkoRemoved = await this.funkoRepository.remove(funkoToRemove)
    return this.funkoMapper.mapToResponseDto(funkoRemoved)
  }
}
