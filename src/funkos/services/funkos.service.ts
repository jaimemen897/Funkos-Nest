import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { FunkosMapper } from '../mapper/funkos-mapper'
import { Funko } from '../entities/funko.entity'

@Injectable()
export class FunkosService {
  private funkoList: Funko[] = []

  constructor(private readonly funkoMapper: FunkosMapper) {}

  create(createFunkoDto: CreateFunkoDto) {
    const funkoToSave = this.funkoMapper.mapToEntityCreateDto(createFunkoDto)
    this.funkoList.push(funkoToSave)
    return this.funkoMapper.mapToResponseDto(funkoToSave)
  }

  findAll() {
    return this.funkoList.map(this.funkoMapper.mapToResponseDto)
  }

  private find(id: number) {
    return this.funkoList.find((funko) => funko.id === id)
  }

  findOne(id: number) {
    const funko = this.find(id)
    if (!funko) {
      throw new NotFoundException(`Funko #${id} not found`)
    } else {
      return this.funkoMapper.mapToResponseDto(funko)
    }
  }

  update(id: number, updateFunkoDto: UpdateFunkoDto) {
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
    const funkoIndex = this.funkoList.findIndex((funko) => funko.id === id)
    if (funkoIndex === -1) {
      throw new NotFoundException(`Funko #${id} not found`)
    } else {
      this.funkoList.splice(funkoIndex, 1)
    }
  }
}
