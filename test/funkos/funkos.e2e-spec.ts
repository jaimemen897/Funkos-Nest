import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, NotFoundException } from '@nestjs/common'
import { ResponseFunkoDto } from '../../src/funkos/dto/response-funko.dto'
import { CreateFunkoDto } from '../../src/funkos/dto/create-funko.dto'
import { UpdateFunkoDto } from '../../src/funkos/dto/update-funko.dto'
import { FunkosController } from '../../src/funkos/controllers/funkos.controller'
import { FunkosService } from '../../src/funkos/services/funkos.service'
import * as request from 'supertest'

describe('FunkosController (e2e)', () => {
  let app: INestApplication
  const myEndpoint = '/funkos'

  const myFunkoResponse: ResponseFunkoDto = {
    id: 1,
    name: 'Funko 1',
    price: 100,
    stock: 10,
    category: 'category 1',
  }

  const createFunkoDto: CreateFunkoDto = {
    name: 'Funko 1',
    price: 100,
    stock: 10,
    category: 'category 1',
  }

  const updateFunkoDto: UpdateFunkoDto = {
    name: 'Funko 1',
    price: 100,
    stock: 10,
    category: 'category 1',
  }

  const mockFunkosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FunkosController],
      providers: [
        FunkosService,
        {
          provide: FunkosService,
          useValue: mockFunkosService,
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /funkos', () => {
    it('should return an array of funkos', async () => {
      mockFunkosService.findAll.mockResolvedValue([myFunkoResponse])
      const { body } = await request(app.getHttpServer())
        .get(myEndpoint)
        .expect(200)
      expect(body).toEqual([myFunkoResponse])
      expect(mockFunkosService.findAll).toHaveBeenCalledTimes(1)
    })
  })

  describe('GET /funkos/:id', () => {
    it('should return a funko', async () => {
      mockFunkosService.findOne.mockResolvedValue(myFunkoResponse)
      const { body } = await request(app.getHttpServer())
        .get(`${myEndpoint}/${myFunkoResponse.id}`)
        .expect(200)
      expect(body).toEqual(myFunkoResponse)
      expect(mockFunkosService.findOne).toHaveBeenCalledTimes(1)
    })
    it('should return a 404', async () => {
      mockFunkosService.findOne.mockRejectedValue(new NotFoundException())

      await request(app.getHttpServer())
        .get(`${myEndpoint}/${myFunkoResponse.id}`)
        .expect(404)
    })
  })

  describe('POST /funkos', () => {
    it('should create a funko', async () => {
      mockFunkosService.create.mockResolvedValue(myFunkoResponse)
      const { body } = await request(app.getHttpServer())
        .post(myEndpoint)
        .send(createFunkoDto)
        .expect(201)
      expect(body).toEqual(myFunkoResponse)
      expect(mockFunkosService.create).toHaveBeenCalledWith(createFunkoDto)
    })
  })

  describe('PUT /funkos/:id', () => {
    it('should update a funko', async () => {
      mockFunkosService.update.mockResolvedValue(myFunkoResponse)
      const { body } = await request(app.getHttpServer())
        .put(`${myEndpoint}/${myFunkoResponse.id}`)
        .send(updateFunkoDto)
        .expect(200)
      expect(body).toEqual(myFunkoResponse)
      expect(mockFunkosService.update).toHaveBeenCalledWith(
        myFunkoResponse.id,
        updateFunkoDto,
      )
    })

    it('should return a 404', async () => {
      mockFunkosService.update.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .put(`${myEndpoint}/${myFunkoResponse.id}`)
        .send(updateFunkoDto)
        .expect(404)
      expect(mockFunkosService.update).toHaveBeenCalledWith(
        myFunkoResponse.id,
        updateFunkoDto,
      )
    })
  })

  describe('DELETE /funkos/:id', () => {
    it('should delete a funko', async () => {
      mockFunkosService.remove.mockResolvedValue(myFunkoResponse)
      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${myFunkoResponse.id}`)
        .expect(204)
    })

    it('should return a 404', async () => {
      mockFunkosService.remove.mockRejectedValue(new NotFoundException())
      await request(app.getHttpServer())
        .delete(`${myEndpoint}/${myFunkoResponse.id}`)
        .expect(404)
    })
  })
})
