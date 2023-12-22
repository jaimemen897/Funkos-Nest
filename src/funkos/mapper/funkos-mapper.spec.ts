import { Test, TestingModule } from '@nestjs/testing'
import { FunkosMapper } from './funkos-mapper'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { Funko } from '../entities/funko.entity'
import { Category } from '../../category/entities/category.entity'
import { ResponseFunkoDto } from '../dto/response-funko.dto'

describe('FunkosMapper', () => {
  let provider: FunkosMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunkosMapper],
    }).compile()

    provider = module.get<FunkosMapper>(FunkosMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })

  describe('mapToEntity', () => {
    let funkosMapper: FunkosMapper

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [FunkosMapper],
      }).compile()

      funkosMapper = module.get<FunkosMapper>(FunkosMapper)
    })
    it('should be defined', () => {
      expect(provider.mapToEntity).toBeDefined()
    })

    it('should map CreateDto to Funko', async () => {
      const createDto: CreateFunkoDto = {
        name: 'Funko 1',
        price: 12.99,
        stock: 10,
        category: 'category',
      }

      const category: Category = {
        id: '51310e5f-4b47-4994-9f66-975bbdacdd35',
        name: 'category',
        updatedAt: new Date(),
        createdAt: new Date(),
        isDeleted: false,
        funkos: [],
      }

      const expectedFunko: Funko = {
        id: 1,
        name: 'Funko 1',
        price: 12.99,
        stock: 10,
        category: category,
      }
      const actualFunko = funkosMapper.mapToEntity(createDto, category)
      expect(actualFunko).toBeInstanceOf(Funko)
      expect(actualFunko.name).toEqual(expectedFunko.name)
      expect(actualFunko.price).toEqual(expectedFunko.price)
      expect(actualFunko.stock).toEqual(expectedFunko.stock)
      expect(actualFunko.category).toEqual(expectedFunko.category)
    })
  })

  describe('mapToDTO', () => {
    let funkosMapper: FunkosMapper

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [FunkosMapper],
      }).compile()

      funkosMapper = module.get<FunkosMapper>(FunkosMapper)
    })
    it('should be defined', () => {
      expect(provider.mapToResponseDto).toBeDefined()
    })

    it('should map Funko to DTO', async () => {
      const funko: Funko = {
        id: 1,
        name: 'Funko 1',
        price: 12.99,
        stock: 10,
        category: {
          id: '51310e5f-4b47-4994-9f66-975bbdacdd35',
          name: 'category',
          updatedAt: new Date(),
          createdAt: new Date(),
          isDeleted: false,
          funkos: [],
        },
      }

      const expectedFunko: ResponseFunkoDto = {
        id: 1,
        name: 'Funko 1',
        price: 12.99,
        stock: 10,
        category: 'category',
      }
      const actualFunko = funkosMapper.mapToResponseDto(funko)
      expect(actualFunko).toBeInstanceOf(ResponseFunkoDto)
      expect(actualFunko.name).toEqual(expectedFunko.name)
      expect(actualFunko.price).toEqual(expectedFunko.price)
      expect(actualFunko.stock).toEqual(expectedFunko.stock)
      expect(actualFunko.category).toEqual(expectedFunko.category)
    })
  })
})
