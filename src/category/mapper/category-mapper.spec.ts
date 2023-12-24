import { Test, TestingModule } from '@nestjs/testing'
import { CategoryMapper } from './category-mapper'
import { Category } from '../entities/category.entity'

describe('CategoryMapper', () => {
  let mapper: CategoryMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryMapper],
    }).compile()

    mapper = module.get<CategoryMapper>(CategoryMapper)
  })

  it('should be defined', () => {
    expect(mapper).toBeDefined()
  })

  describe('mapToResponseDto', () => {
    it('should return a CategoryResponseDto', () => {
      const entity: Category = {
        id: 'd69cf3db-b77d-4181-b3cd-5ca8107fb6a7',
        name: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        funkos: [],
      }
      const response = mapper.mapToResponseDto(entity)
      expect(response).toEqual(entity)
    })
  })
})
