import {
  BadRequestException,
  Inject,
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
import { StorageService } from '../../storage/storage.service'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import { NotificationGateway } from '../../websockets/notification.gateway'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'

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
    private notificationGateway: NotificationGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Finding all funkos')
    this.logger.log(JSON.stringify(query))

    const cache = await this.cacheManager.get(
      `all_funkos-page-${JSON.stringify(query)}`,
    )
    if (cache) {
      this.logger.log('Funkos from cache')
      return cache
    }

    const queryBuilder = this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')

    const pagination = await paginate(query, queryBuilder, {
      sortableColumns: ['id', 'name', 'price', 'stock'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['id', 'name', 'price', 'stock'],
      filterableColumns: {
        id: [FilterOperator.EQ, FilterSuffix.NOT],
        name: [FilterOperator.CONTAINS],
        price: [FilterOperator.EQ, FilterOperator.GT, FilterOperator.LT],
        stock: [FilterOperator.EQ, FilterOperator.GT, FilterOperator.LT],
      },
      //si ponemos select [] hay que quitar el mapResponseDto
    })

    const res = {
      data: (pagination.data ?? []).map((funko) =>
        this.funkoMapper.mapToResponseDto(funko),
      ),
      meta: pagination.meta,
      links: pagination.links,
    }

    await this.cacheManager.set(
      `all_funkos-page-${JSON.stringify(query)}`,
      res,
      60,
    )

    return res
  }

  async findOne(id: number): Promise<ResponseFunkoDto> {
    this.logger.log(`Finding funko with id ${id}`)

    const cachedFunko: ResponseFunkoDto = await this.cacheManager.get(
      `funko-${id}`,
    )
    if (cachedFunko) {
      this.logger.log(`Funko #${id} from cache`)
      return cachedFunko
    }
    const funko = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.category', 'category')
      .where('funko.id = :id', { id })
      .getOne()
    if (funko) {
      await this.cacheManager.set(`funko-${id}`, funko, 60)
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
    const dto = this.funkoMapper.mapToResponseDto(funkoCreated)
    this.onChange('CREATE', dto)
    await this.invalidateCache('all-funkos')
    return dto
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
    const dto = this.funkoMapper.mapToResponseDto(funkoUpdated)
    this.onChange('UPDATE', dto)
    await this.invalidateCache(`funko-${id}`)
    await this.invalidateCache('all-funkos')
    return dto
  }

  async updateImage(id: number, file: Express.Multer.File) {
    this.logger.log(`Updating funko image with id ${id}`)
    const funkoToUpdate = await this.funkoRepository.findOneBy({ id })
    if (!funkoToUpdate) {
      throw new NotFoundException(`Funko #${id} not found`)
    }
    if (!file) {
      throw new BadRequestException('File is required')
    }
    if (funkoToUpdate.image !== Funko.IMAGE_DEFAULT) {
      this.logger.log(`Eliminando imagen antigua ${funkoToUpdate.image}`)
      try {
        this.storageService.removeFile(funkoToUpdate.image)
      } catch (error) {
        this.logger.error(error)
      }
    }

    funkoToUpdate.image = file.filename
    const funkoUpdated = await this.funkoRepository.save(funkoToUpdate)
    const dto = this.funkoMapper.mapToResponseDto(funkoUpdated)
    this.onChange('UPDATE', dto)
    await this.invalidateCache(`funko-${id}`)
    await this.invalidateCache('all-funkos')
    return dto
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
    const dto = this.funkoMapper.mapToResponseDto(funkoRemoved)
    this.onChange('DELETE', dto)
    await this.invalidateCache(`funko-${id}`)
    await this.invalidateCache('all-funkos')
    return dto
  }

  private onChange(
    tipo: 'CREATE' | 'UPDATE' | 'DELETE',
    data: ResponseFunkoDto,
  ) {
    this.notificationGateway.sendMessage(tipo, data)
  }

  private async invalidateCache(keyPattern: string) {
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.includes(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }
}
