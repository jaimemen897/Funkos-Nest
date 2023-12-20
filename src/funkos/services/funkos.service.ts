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
import { Repository } from 'typeorm'
import { Category } from '../../category/entities/category.entity'

@Injectable()
export class FunkosService {
  private logger = new Logger('FunkosService')

  constructor(
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    private readonly funkoMapper: FunkosMapper,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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

  async remove(id: number) {
    this.logger.log(`Deleting funko with id ${id}`)
    const funko = await this.findOne(id)
    if (!funko) {
      throw new NotFoundException(`Funko #${id} not found`)
    }
    return this.funkoRepository.delete(id)
  }
}
