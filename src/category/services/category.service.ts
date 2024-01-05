import {
  BadRequestException,
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

@Injectable()
export class CategoryService {
  private logger = new Logger('FunkosService')

  constructor(
    private readonly categoryMapper: CategoryMapper,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    this.logger.log('Finding all categories')
    const categories = await this.categoryRepository.find()
    return categories.map((category) =>
      this.categoryMapper.mapToResponseDto(category),
    )
  }

  async findOne(id: uuid) {
    this.logger.log(`Finding category with id ${id}`)
    const category = await this.categoryRepository.findOneBy({ id })
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`)
    } else {
      return this.categoryMapper.mapToResponseDto(category)
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
    return this.categoryMapper.mapToResponseDto(category)
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
      return this.categoryMapper.mapToResponseDto(categoryUpdated)
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
    return this.categoryRepository.save(category)
  }
}
