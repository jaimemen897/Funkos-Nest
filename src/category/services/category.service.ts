import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../entities/category.entity'
import { Repository } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { CategoryMapper } from '../mapper/category-mapper'
import { NotificationGateway } from '../../websockets/notification.gateway'
import { CategoryResponseDto } from '../dto/category-response.dto'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

@Injectable()
export class CategoryService {
  private logger = new Logger('FunkosService')

  constructor(
    private readonly categoryMapper: CategoryMapper,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly notificationGateway: NotificationGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    this.logger.log('Finding all categories')
    const categoriesFromCache: CategoryResponseDto[] =
      await this.cacheManager.get('categories')
    if (categoriesFromCache) {
      this.logger.log('Categories from cache')
      return categoriesFromCache
    }
    const categories = await this.categoryRepository.find()
    const dto = categories.map((category) =>
      this.categoryMapper.mapToResponseDto(category),
    )
    await this.cacheManager.set('categories', dto)
    return dto
  }

  async findOne(id: uuid) {
    this.logger.log(`Finding category with id ${id}`)
    const categoryFromCache: CategoryResponseDto = await this.cacheManager.get(
      `category-${id}`,
    )
    if (categoryFromCache) {
      this.logger.log('Category from cache')
      return categoryFromCache
    }
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`)
    } else {
      const dto = this.categoryMapper.mapToResponseDto(category)
      await this.cacheManager.set(`category-${id}`, dto)
      return dto
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    this.logger.log('Creating a new category')
    const existingCategory = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    })
    if (existingCategory) {
      if (!existingCategory.isDeleted) {
        throw new BadRequestException(
          `Category with name ${createCategoryDto.name} already exists`,
        )
      } else {
        existingCategory.isDeleted = false
        return this.categoryRepository.save(existingCategory)
      }
    }
    const categoryToSave = this.categoryRepository.create(createCategoryDto)
    const category = await this.categoryRepository.save(categoryToSave)
    const dto = this.categoryMapper.mapToResponseDto(category)
    this.onChange('CREATE', dto)
    await this.invalidateCache('categories')
    return dto
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    this.logger.log(`Updating category with id ${id}`)
    const category = await this.findOne(id)
    if (category) {
      if (category.isDeleted) {
        throw new BadRequestException(`Category #${id} is deleted`)
      }
      const updatedCategory = this.categoryRepository.create({
        ...category,
        ...updateCategoryDto,
      })
      const categoryUpdated =
        await this.categoryRepository.save(updatedCategory)
      const dto = this.categoryMapper.mapToResponseDto(categoryUpdated)
      this.onChange('UPDATE', dto)
      await this.invalidateCache(`category-${id}`)
      await this.invalidateCache('categories')
      return dto
    } else {
      throw new NotFoundException(`Category #${id} not found`)
    }
  }

  async remove(id: uuid) {
    this.logger.log(`Deleting category with id ${id}`)
    const category = await this.findOne(id)
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`)
    }
    category.isDeleted = true
    const dto = await this.categoryRepository.save(category)
    this.onChange('DELETE', dto)
    await this.invalidateCache(`category-${id}`)
    await this.invalidateCache('categories')
    return dto
  }

  private onChange(
    tipo: 'CREATE' | 'UPDATE' | 'DELETE',
    data: CategoryResponseDto,
  ) {
    this.notificationGateway.sendMessage(tipo, data)
  }

  async invalidateCache(keyPattern: string) {
    const cackeKeys = await this.cacheManager.store.keys()
    const keysToDelete = cackeKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }
}
