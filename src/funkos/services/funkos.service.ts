import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FunkosMapper } from '../mapper/funkos-mapper'
import { Funko } from '../entities/funko.entity'

@Injectable()
export class FunkosService {
  private funkoList: Funko[] = []
  private logger = new Logger('FunkosService')

  constructor(private readonly funkoMapper: FunkosMapper) {}

  create(createFunkoDto: CreateFunkoDto) {
    this.logger.log('Creating a new funko')
    const funkoToSave = this.funkoMapper.mapToEntityCreateDto(createFunkoDto)
    this.funkoList.push(funkoToSave)
    return this.funkoMapper.mapToResponseDto(funkoToSave)
  }

  findAll() {
    this.logger.log('Finding all funkos')
    return this.funkoList.map(this.funkoMapper.mapToResponseDto)
  }

  findOne(id: number) {
    this.logger.log(`Finding funko with id ${id}`)
    const funko = this.find(id)
    if (!funko) {
      throw new NotFoundException(`Funko #${id} not found`)
    } else {
      return this.funkoMapper.mapToResponseDto(funko)
    }
  }

  update(id: number, updateFunkoDto: UpdateFunkoDto) {
    this.logger.log(`Updating funko with id ${id}`)
    const funko = this.findOne(id)
    if (funko) {
      const updatedFunko = this.funkoMapper.mapToEntityUpdateDto(
        updateFunkoDto,
        this.funkoMapper.mapToEntityCreateDto(this.find(id)),
      )
      this.funkoList = this.funkoList.map((funko) =>
        funko.id === id ? updatedFunko : funko,
      )
      return updatedFunko
    } else {
      throw new NotFoundException(`Funko #${id} not found`)
    }
  }

  remove(id: number) {
    this.logger.log(`Deleting funko with id ${id}`)
    const funkoIndex = this.funkoList.findIndex((funko) => funko.id === id)
    if (funkoIndex === -1) {
      throw new NotFoundException(`Funko #${id} not found`)
    } else {
      this.funkoList.splice(funkoIndex, 1)
    }
  }

  private find(id: number) {
    this.logger.log(`Finding funko with id ${id}`)
    return this.funkoList.find((funko) => funko.id === id)
  }
}
