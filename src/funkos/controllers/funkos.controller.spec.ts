import { Test, TestingModule } from '@nestjs/testing'
import { FunkosController } from './funkos.controller'
import { FunkosService } from '../services/funkos.service'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { Paginated } from 'nestjs-paginate'

describe('FunkosController', () => {
  let controller: FunkosController
  let service: FunkosService

  const funkosServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateImage: jest.fn(),
    remove: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [FunkosController],
      providers: [
        {
          provide: FunkosService,
          useValue: funkosServiceMock,
        },
      ],
    }).compile()

    controller = module.get<FunkosController>(FunkosController)
    service = module.get<FunkosService>(FunkosService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('should return an array of funkos', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'funkos',
      }

      const testFunkos = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          totalPages: 1,
          currentPage: 1,
        },
        links: {
          current: 'http://localhost:3000/funkos?page=1&limit=10&sort=name:ASC',
        },
      } as Paginated<ResponseFunkoDto>

      jest.spyOn(service, 'findAll').mockResolvedValue(testFunkos)
      const result: any = await controller.findAll(paginateOptions)
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)
      expect(result.meta.totalPages).toEqual(1)
      expect(result.links.current).toEqual(
        `http://localhost:3000/funkos?page=${paginateOptions.page}&limit=${paginateOptions.limit}&sort=name:ASC`,
      )
      expect(service.findAll).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a funko', async () => {
      const id = 1
      const mockResult: ResponseFunkoDto = new ResponseFunkoDto()

      jest.spyOn(service, 'findOne').mockResolvedValue(mockResult)
      await controller.findOne(id)
      expect(service.findOne).toHaveBeenCalledWith(id)
      expect(mockResult).toBeInstanceOf(ResponseFunkoDto)
    })

    it('should throw an error if funko not found', async () => {
      const id = 1
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('should create a funko', async () => {
      const mockResult: ResponseFunkoDto = new ResponseFunkoDto()
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'create').mockResolvedValue(mockResult)
      await controller.create(mockData)
      expect(service.create).toHaveBeenCalledWith(mockData)
      expect(mockResult).toBeInstanceOf(ResponseFunkoDto)
    })

    it('should throw an error if not authenticated', async () => {
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: 10,
        category: 'category',
      }
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new UnauthorizedException())
      await expect(controller.create(mockData)).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('should throw an error if user does not have ADMIN role', async () => {
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new ForbiddenException())
      await expect(controller.create(mockData)).rejects.toThrow(
        ForbiddenException,
      )
    })

    it('should throw an error bad request name empty', async () => {
      const mockData = {
        name: '',
        price: 10,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())
      await expect(controller.create(mockData)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw an error bad request price empty', async () => {
      const mockData = {
        name: 'Funko 1',
        price: undefined,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())
      await expect(controller.create(mockData)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw an error bad request stock empty', async () => {
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: undefined,
        category: 'category',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())
      await expect(controller.create(mockData)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw an error bad request category empty', async () => {
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: 10,
        category: '',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())
      await expect(controller.create(mockData)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw an error bad request price negative', async () => {
      const mockData = {
        name: 'Funko 1',
        price: -10,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())
      await expect(controller.create(mockData)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw an error bad request stock negative', async () => {
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: -10,
        category: 'category',
      }
      jest.spyOn(service, 'create').mockRejectedValue(new NotFoundException())
      await expect(controller.create(mockData)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('update', () => {
    it('should update a funko', async () => {
      const id = 1
      const mockResult: ResponseFunkoDto = new ResponseFunkoDto()
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'update').mockResolvedValue(mockResult)
      await controller.update(id, mockData)
      expect(service.update).toHaveBeenCalledWith(id, mockData)
      expect(mockResult).toBeInstanceOf(ResponseFunkoDto)
    })

    it('should throw an error if funko not found', async () => {
      const id = 1
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(id, mockData)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('should throw an error bad request name empty', async () => {
      const id = 1
      const mockData = {
        name: '',
        price: 10,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())
      await expect(controller.update(id, mockData)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should throw an error bad request price empty', async () => {
      const id = 1
      const mockData = {
        name: 'Funko 1',
        price: undefined,
        stock: 10,
        category: 'category',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())
      await expect(controller.update(id, mockData)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should throw an error bad request stock empty', async () => {
      const id = 1
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: undefined,
        category: 'category',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())
      await expect(controller.update(id, mockData)).rejects.toThrow(
        BadRequestException,
      )
    })

    it('should throw an error bad request category empty', async () => {
      const id = 1
      const mockData = {
        name: 'Funko 1',
        price: 10,
        stock: 10,
        category: '',
      }
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException())
      await expect(controller.update(id, mockData)).rejects.toThrow(
        BadRequestException,
      )
    })
  })

  describe('updateImage', () => {
    it('should update a funko image', async () => {
      const id = 1
      const mockResult: ResponseFunkoDto = new ResponseFunkoDto()
      const mockFile: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'image',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'destination',
        filename: 'filename',
        path: 'path',
        size: 1,
        stream: null,
        buffer: null,
      }
      jest.spyOn(service, 'updateImage').mockResolvedValue(mockResult)
      await controller.updateImage(id, mockFile)
      expect(service.updateImage).toHaveBeenCalledWith(id, mockFile)
      expect(mockResult).toBeInstanceOf(ResponseFunkoDto)
    })
    it('bad request file too large', async () => {
      const id = 1
      const mockFile: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'image',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'destination',
        filename: 'filename',
        path: 'path',
        size: 10000000,
        stream: null,
        buffer: null,
      }
      jest
        .spyOn(service, 'updateImage')
        .mockRejectedValue(new BadRequestException())
      await expect(controller.updateImage(id, mockFile)).rejects.toThrow(
        BadRequestException,
      )
    })
    it('bad request file not image', async () => {
      const id = 1
      const mockFile: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'image',
        encoding: '7bit',
        mimetype: 'text/plain',
        destination: 'destination',
        filename: 'filename',
        path: 'path',
        size: 1,
        stream: null,
        buffer: null,
      }
      jest
        .spyOn(service, 'updateImage')
        .mockRejectedValue(new BadRequestException())
      await expect(controller.updateImage(id, mockFile)).rejects.toThrow(
        BadRequestException,
      )
    })
    it('should throw an error if funko not found', async () => {
      const id = 1
      const mockFile: Express.Multer.File = {
        fieldname: 'image',
        originalname: 'image',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'destination',
        filename: 'filename',
        path: 'path',
        size: 1,
        stream: null,
        buffer: null,
      }
      jest
        .spyOn(service, 'updateImage')
        .mockRejectedValue(new NotFoundException())
      await expect(controller.updateImage(id, mockFile)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('remove', () => {
    it('should remove a funko', async () => {
      const id = 1
      const mockResult: ResponseFunkoDto = new ResponseFunkoDto()
      jest.spyOn(service, 'remove').mockResolvedValue(undefined)
      await controller.remove(id)
      expect(service.remove).toHaveBeenCalledWith(id)
      expect(mockResult).toBeInstanceOf(ResponseFunkoDto)
    })

    it('should throw an error if funko not found', async () => {
      const id = 1
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
    })
  })
})
