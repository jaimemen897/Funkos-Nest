import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, NotFoundException } from '@nestjs/common'
import * as request from 'supertest'
import { CreateCategoryDto } from '../../src/category/dto/create-category.dto'
import { CategoryResponseDto } from '../../src/category/dto/category-response.dto'
import { UpdateCategoryDto } from '../../src/category/dto/update-category.dto'
import { CategoryController } from '../../src/category/controllers/category.controller'
import { CategoryService } from '../../src/category/services/category.service'
import { CacheModule } from '@nestjs/cache-manager'

describe('categoryController (e2e)', () => {
  let app: INestApplication
  const myEndpoint = '/category'

  const createCategoryDto: CreateCategoryDto = {
    name: 'category 1',
  }

  const updateCategoryDto: UpdateCategoryDto = {
    name: 'Category updated',
  }

  const myCategoryResponse: CategoryResponseDto = {
    id: '0c80b908-b076-4228-b448-cc28ea211cd4',
    name: 'category 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  }

  const mockCategoryService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /category', () => {
    it('should return an array of category', async () => {
      mockCategoryService.findAll.mockResolvedValue([myCategoryResponse])
      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)
      const bodyDate = body.map((category) => {
        category.createdAt = new Date(category.createdAt)
        category.updatedAt = new Date(category.updatedAt)
        return category
      })
      expect(bodyDate).toEqual([myCategoryResponse])
      expect(mockCategoryService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /category/:id', () => {
    it('should return a category', async () => {
      mockCategoryService.findOne.mockResolvedValue(myCategoryResponse)
      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}/${myCategoryResponse.id}`)
        .expect(200)
      body.createdAt = new Date(body.createdAt)
      body.updatedAt = new Date(body.updatedAt)
      expect(body).toEqual(myCategoryResponse)
      expect(mockCategoryService.findOne).toHaveBeenCalledTimes(1)
    })
    it('should return a 404', async () => {
      mockCategoryService.findOne.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .get(`${myEndpoint}/${myCategoryResponse.id}`)
        .expect(404)
    })
  })

  describe('POST /category', () => {
    it('should create a category', async () => {
      mockCategoryService.create.mockResolvedValue(myCategoryResponse)
      const { body } = await request(app.getHttpServer())
        .post(myEndpoint)
        .send(createCategoryDto)
        .expect(201)
      body.createdAt = new Date(body.createdAt)
      body.updatedAt = new Date(body.updatedAt)
      expect(body).toEqual(myCategoryResponse)
      expect(mockCategoryService.create).toHaveBeenCalledWith(createCategoryDto)
    })
  })

  describe('PUT /category/:id', () => {
    it('should update a category', async () => {
      mockCategoryService.update.mockResolvedValue(myCategoryResponse)
      const { body } = await request(app.getHttpServer())
        .put(`${myEndpoint}/${myCategoryResponse.id}`)
        .send(updateCategoryDto)
        .expect(200)
      body.createdAt = new Date(body.createdAt)
      body.updatedAt = new Date(body.updatedAt)
      expect(body).toEqual(myCategoryResponse)
      expect(mockCategoryService.update).toHaveBeenCalledWith(
        myCategoryResponse.id,
        updateCategoryDto,
      )
    })

    it('should return a 404', async () => {
      mockCategoryService.update.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .put(`${myEndpoint}/${myCategoryResponse.id}`)
        .send(updateCategoryDto)
        .expect(404)
      expect(mockCategoryService.update).toHaveBeenCalledWith(
        myCategoryResponse.id,
        updateCategoryDto,
      )
    })
  })

  describe('DELETE /category/:id', () => {
    it('should delete a category', async () => {
      mockCategoryService.remove.mockResolvedValue(myCategoryResponse)
      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${myCategoryResponse.id}`)
        .expect(204)
    })

    it('should return a 404', async () => {
      mockCategoryService.remove.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${myCategoryResponse.id}`)
        .expect(404)
    })
  })
})
