import { Test, TestingModule } from '@nestjs/testing'
import { FunkosService } from './funkos.service'
import { Repository } from 'typeorm'
import { Funko } from '../entities/funko.entity'
import { FunkosMapper } from '../mapper/funkos-mapper'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import { Category } from '../../category/entities/category.entity'
import { NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'

describe('FunkosService', () => {
  let service: FunkosService
  let funkoRepository: Repository<Funko>
  let categoryRepository: Repository<Category>
  let mapper: FunkosMapper

  const funkoMapperMock = {
    mapToEntity: jest.fn(),
    mapToResponseDto: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FunkosService,
        { provide: FunkosMapper, useValue: funkoMapperMock },
        {
          provide: 'FunkoRepository',
          useClass: Repository,
        },
        {
          provide: 'CategoryRepository',
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<FunkosService>(FunkosService)
    funkoRepository = module.get<Repository<Funko>>('FunkoRepository')
    categoryRepository = module.get<Repository<Category>>('CategoryRepository')
    mapper = module.get<FunkosMapper>(FunkosMapper)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of funkos', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      }

      jest
        .spyOn(funkoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      jest
        .spyOn(mapper, 'mapToResponseDto')
        .mockReturnValue(new ResponseFunkoDto())

      const result = await service.findAll()

      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    it('should return a funko', async () => {
      const result = new Funko()
      const resultDto = new ResponseFunkoDto()
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(result),
      }

      jest
        .spyOn(funkoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      jest.spyOn(mapper, 'mapToResponseDto').mockReturnValue(resultDto)

      expect(await service.findOne(1)).toEqual(resultDto)
      expect(mapper.mapToResponseDto).toHaveBeenCalledTimes(1)
    })

    it('should throw 404 not found', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }

      jest
        .spyOn(funkoRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a new funko', async () => {
      const createFunkoDto = new CreateFunkoDto()
      const mockCategory = new Category()
      const mockFunko = new Funko()
      const mockResponseFunkoDto = new ResponseFunkoDto()

      jest.spyOn(service, 'checkCategoria').mockResolvedValue(mockCategory)

      jest.spyOn(mapper, 'mapToEntity').mockReturnValue(mockFunko)

      jest.spyOn(funkoRepository, 'save').mockResolvedValue(mockFunko)

      jest
        .spyOn(mapper, 'mapToResponseDto')
        .mockReturnValue(mockResponseFunkoDto)

      expect(await service.create(createFunkoDto)).toEqual(mockResponseFunkoDto)
      expect(service.checkCategoria).toHaveBeenCalledTimes(1)
      expect(mapper.mapToEntity).toHaveBeenCalledTimes(1)
      expect(funkoRepository.save).toHaveBeenCalledTimes(1)
    })

    it('should throw 400 bad request, category not found', async () => {
      const createFunkoDto = new CreateFunkoDto()
      jest.spyOn(service, 'checkCategoria').mockRejectedValue(new Error())
      await expect(service.create(createFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, name empty', async () => {
      const createFunkoDto = new CreateFunkoDto()
      createFunkoDto.name = ''
      await expect(service.create(createFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, category empty', async () => {
      const createFunkoDto = new CreateFunkoDto()
      createFunkoDto.category = ''
      await expect(service.create(createFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, price negative', async () => {
      const createFunkoDto = new CreateFunkoDto()
      createFunkoDto.price = -1
      await expect(service.create(createFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, stock negative', async () => {
      const createFunkoDto = new CreateFunkoDto()
      createFunkoDto.stock = -1
      await expect(service.create(createFunkoDto)).rejects.toThrow()
    })
  })

  describe('update', () => {
    it('should update a funko', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      const mockFunko = new Funko()
      const mockCategory = new Category()
      const mockResponseFunkoDto = new ResponseFunkoDto()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResponseFunkoDto)

      jest.spyOn(service, 'checkCategoria').mockResolvedValue(mockCategory)

      jest.spyOn(funkoRepository, 'save').mockResolvedValue(mockFunko)

      jest
        .spyOn(mapper, 'mapToResponseDto')
        .mockReturnValue(mockResponseFunkoDto)

      expect(await service.update(1, updateFunkoDto)).toEqual(
        mockResponseFunkoDto,
      )
      expect(service.findOne).toHaveBeenCalledTimes(1)
      expect(service.checkCategoria).toHaveBeenCalledTimes(1)
    })

    it('should throw 404 not found', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, category not found', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      jest.spyOn(service, 'checkCategoria').mockRejectedValue(new Error())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, name empty', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.name = ''
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, category empty', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.category = ''
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, price negative', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.price = -1
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, stock negative', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.stock = -1
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, price empty', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.price = null
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, stock empty', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.stock = null
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, price not a number', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.price = NaN
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })

    it('should throw 400 bad request, stock not a number', async () => {
      const updateFunkoDto = new UpdateFunkoDto()
      updateFunkoDto.stock = NaN
      jest.spyOn(service, 'findOne').mockResolvedValue(new ResponseFunkoDto())
      await expect(service.update(1, updateFunkoDto)).rejects.toThrow()
    })
  })

  describe('delete', () => {
    it('should remove a funko', async () => {
      const mockResponseFunkoDto = new ResponseFunkoDto()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResponseFunkoDto)

      jest.spyOn(funkoRepository, 'delete').mockResolvedValue(undefined)
    })

    it('should throw 404 not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new Error())
      await expect(service.remove(1)).rejects.toThrow()
    })
  })

  describe('checkCategoria', () => {
    it('should return a category', async () => {
      const result = new Category()
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(result),
      }

      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)

      expect(await service.checkCategoria('test')).toEqual(result)
    })

    it('should throw 400 bad request', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }

      jest
        .spyOn(categoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      await expect(service.checkCategoria('test')).rejects.toThrow()
    })
  })
})
