import { Test, TestingModule } from '@nestjs/testing'
import { CategoryController } from './category.controller'
import { CategoryService } from '../services/category.service'
import { CategoryResponseDto } from '../dto/category-response.dto'
import { CacheModule } from '@nestjs/cache-manager'

describe('CategoryController', () => {
  let controller: CategoryController
  let service: CategoryService

  const categoryServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: categoryServiceMock,
        },
      ],
    }).compile()

    controller = module.get<CategoryController>(CategoryController)
    service = module.get<CategoryService>(CategoryService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const result: Array<CategoryResponseDto> = []
      jest.spyOn(service, 'findAll').mockResolvedValue(result)
      await controller.findAll()
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a category', async () => {
      const id = 'd69cf3db-b77d-4181-b3cd-5ca8107fb6a7'
      const mockResult: CategoryResponseDto = new CategoryResponseDto()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(mockResult).toBeInstanceOf(CategoryResponseDto)
    })
  })

  describe('create', () => {
    it('should create a category', async () => {
      const mockResult: CategoryResponseDto = new CategoryResponseDto()
      const mockBody = {
        name: 'Marvel',
      }

      jest.spyOn(service, 'create').mockResolvedValue(mockResult)
      await controller.create(mockBody)
      expect(service.create).toHaveBeenCalledWith(mockBody)
      expect(mockResult).toBeInstanceOf(CategoryResponseDto)
    })
  })

  describe('update', () => {
    it('should update a category', async () => {
      const id = 'd69cf3db-b77d-4181-b3cd-5ca8107fb6a7'
      const mockResult: CategoryResponseDto = new CategoryResponseDto()
      const mockBody = {
        name: 'Marvel',
      }

      jest.spyOn(service, 'update').mockResolvedValue(mockResult)
      await controller.update(id, mockBody)
      expect(service.update).toHaveBeenCalledWith(id, mockBody)
      expect(mockResult).toBeInstanceOf(CategoryResponseDto)
    })
  })

  describe('remove', () => {
    it('should remove a category', async () => {
      const id = 'd69cf3db-b77d-4181-b3cd-5ca8107fb6a7'

      jest.spyOn(service, 'remove').mockResolvedValue(undefined)
      await controller.remove(id)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
