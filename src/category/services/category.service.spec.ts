import { Test, TestingModule } from '@nestjs/testing'
import { CategoryService } from './category.service'
import { Repository } from 'typeorm'
import { Category } from '../entities/category.entity'
import { CategoryMapper } from '../mapper/category-mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'
import { CategoryResponseDto } from '../dto/category-response.dto'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'

describe('CategoryService', () => {
  let service: CategoryService
  let repositoryMock: Repository<Category>
  let mapper: CategoryMapper

  const categoryMapperMock = {
    mapToEntity: jest.fn(),
    mapToResponseDto: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryMapper, useValue: categoryMapperMock },
        { provide: getRepositoryToken(Category), useClass: Repository },
      ],
    }).compile()

    service = module.get<CategoryService>(CategoryService)
    repositoryMock = module.get<Repository<Category>>('CategoryRepository')
    mapper = module.get<CategoryMapper>(CategoryMapper)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result = [new Category()]
      jest.spyOn(repositoryMock, 'find').mockResolvedValue(result)
      expect(await service.findAll()).toEqual(result)
    })
  })

  describe('findOne', () => {
    it('should return a category', async () => {
      const result = new Category()
      const resultDto = new CategoryResponseDto()
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(result)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(resultDto)
      expect(await service.findOne('1')).toEqual(resultDto)
      expect(mapper.mapToResponseDto).toHaveBeenCalledTimes(1)
    })

    it('should throw NotFoundException', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockResolvedValue(undefined)
      expect(service.findOne('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should return a category', async () => {
      const categoryCreate = new CreateCategoryDto()
      categoryCreate.name = 'test'
      const result = new Category()
      const resultDto = new CategoryResponseDto()

      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(undefined)
      jest.spyOn(repositoryMock, 'create').mockReturnValue(result)
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(result)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(resultDto)

      expect(await service.create(categoryCreate)).toEqual(resultDto)
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1)
      expect(repositoryMock.create).toHaveBeenCalledTimes(1)
      expect(repositoryMock.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('update', () => {
    it('should return a category', async () => {
      const category = new Category()
      category.name = 'test'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(category),
      }

      const mockUpdateCategoryDto = new UpdateCategoryDto()

      jest
        .spyOn(repositoryMock, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(category)
      jest.spyOn(repositoryMock, 'create').mockReturnValue(category)
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(category)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(category)

      const result = await service.update('1', mockUpdateCategoryDto)
      expect(result).toEqual(category)
    })
  })

  describe('remove', () => {
    it('should return a category', async () => {
      const category = new Category()
      category.name = 'test'

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(category),
      }

      jest
        .spyOn(repositoryMock, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(category)
      jest.spyOn(repositoryMock, 'create').mockReturnValue(category)
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(category)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(category)

      const result = await service.remove('1')
      expect(result).toEqual(category)
    })
  })
})
