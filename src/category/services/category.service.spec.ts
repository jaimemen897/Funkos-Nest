import { Test, TestingModule } from '@nestjs/testing'
import { CategoryService } from './category.service'
import { Repository } from 'typeorm'
import { Category } from '../entities/category.entity'
import { CategoryMapper } from '../mapper/category-mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CategoryResponseDto } from '../dto/category-response.dto'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { Cache } from 'cache-manager'
import { NotificationGateway } from '../../websockets/notification.gateway'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

describe('CategoryService', () => {
  let service: CategoryService
  let repositoryMock: Repository<Category>
  let mapper: CategoryMapper
  let cacheManager: Cache
  let notificationGateway: NotificationGateway

  const categoryMapperMock = {
    mapToEntity: jest.fn(),
    mapToResponseDto: jest.fn(),
  }

  const notificationGatewayMock = {
    sendMessage: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: CategoryMapper, useValue: categoryMapperMock },
        { provide: getRepositoryToken(Category), useClass: Repository },
        {
          provide: NotificationGateway,
          useValue: notificationGatewayMock,
        },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile()

    service = module.get<CategoryService>(CategoryService)
    repositoryMock = module.get<Repository<Category>>('CategoryRepository')
    mapper = module.get<CategoryMapper>(CategoryMapper)
    cacheManager = module.get<Cache>(CACHE_MANAGER)
    notificationGateway = module.get<NotificationGateway>(NotificationGateway)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const category = [new Category()]
      jest.spyOn(repositoryMock, 'find').mockResolvedValue(category)
      jest
        .spyOn(mapper, 'mapToResponseDto')
        .mockReturnValue(new CategoryResponseDto())
      const result = await service.findAll()
      expect(result).toEqual([new CategoryResponseDto()])
    })
  })

  describe('findOne', () => {
    it('should return a category', async () => {
      const result = new Category()
      const resultDto = new CategoryResponseDto()
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(result)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(resultDto)
      expect(await service.findOne('1')).toEqual(resultDto)
    })

    it('should throw NotFoundException', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(undefined)
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should return a category', async () => {
      const categoryCreate = new CreateCategoryDto()
      categoryCreate.name = 'test'
      const result = new Category()
      const resultDto = new CategoryResponseDto()

      jest
        .spyOn(notificationGatewayMock, 'sendMessage')
        .mockResolvedValue('CREATE')
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(undefined)
      jest.spyOn(repositoryMock, 'create').mockReturnValue(result)
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(result)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(resultDto)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      jest.spyOn(notificationGateway, 'sendMessage').mockImplementation()

      expect(await service.create(categoryCreate)).toEqual(resultDto)
      expect(repositoryMock.findOneBy).toHaveBeenCalledTimes(1)
      expect(repositoryMock.create).toHaveBeenCalledTimes(1)
      expect(repositoryMock.save).toHaveBeenCalledTimes(1)
    })
    it('should throw BadRequestException already exists', async () => {
      const categoryCreate = new CreateCategoryDto()
      categoryCreate.name = 'test'
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(new Category())
      await expect(service.create(categoryCreate)).rejects.toThrow(
        'Category with name test already exists',
      )
    })
    it('should throw BadRequestException name empty', async () => {
      const categoryCreate = new CreateCategoryDto()
      categoryCreate.name = ''
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(new Category())
      await expect(service.create(categoryCreate)).rejects.toThrow(
        BadRequestException,
      )
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
        .spyOn(notificationGatewayMock, 'sendMessage')
        .mockResolvedValue('UPDATE')
      jest
        .spyOn(repositoryMock, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(category)
      jest.spyOn(repositoryMock, 'create').mockReturnValue(category)
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(category)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(category)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      jest.spyOn(notificationGateway, 'sendMessage').mockImplementation()

      const result = await service.update('1', mockUpdateCategoryDto)
      expect(result).toEqual(category)
    })
    it('should throw BadRequestException', async () => {
      const category = new Category()
      category.name = 'test'
      category.isDeleted = true

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

      await expect(service.update('1', mockUpdateCategoryDto)).rejects.toThrow(
        BadRequestException,
      )
    })
    it('should throw NotFoundException', async () => {
      const mockUpdateCategoryDto = new UpdateCategoryDto()
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(undefined)
      await expect(service.update('1', mockUpdateCategoryDto)).rejects.toThrow(
        NotFoundException,
      )
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
        .spyOn(notificationGatewayMock, 'sendMessage')
        .mockResolvedValue('DELETE')
      jest
        .spyOn(repositoryMock, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(category)
      jest.spyOn(repositoryMock, 'create').mockReturnValue(category)
      jest.spyOn(repositoryMock, 'save').mockResolvedValue(category)
      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(category)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])
      jest.spyOn(notificationGateway, 'sendMessage').mockImplementation()

      const result = await service.remove('1')
      expect(result).toEqual(category)
    })
    it('should throw NotFoundException', async () => {
      jest.spyOn(repositoryMock, 'findOneBy').mockResolvedValue(undefined)
      await expect(service.remove('1')).rejects.toThrow(NotFoundException)
    })
  })
})
