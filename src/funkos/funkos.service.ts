import { Injectable } from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { Funko } from './entities/funko.entity'

@Injectable()
export class FunkosService {
  private funkoList: Funko[] = []
  private idCount: number = 1

  create(createFunkoDto: CreateFunkoDto) {
    const funko = new Funko()
    funko.id = this.idCount
    funko.name = createFunkoDto.name
    funko.category = createFunkoDto.category
    this.idCount++
    this.funkoList.push(funko)
    return funko
  }

  findAll() {
    return this.funkoList
  }

  findOne(id: number) {
    return this.funkoList.find((funko) => funko.id === id)
  }

  update(id: number, updateFunkoDto: UpdateFunkoDto) {
    const funko = this.findOne(id)
    if (funko) {
      funko.name = updateFunkoDto.name
      funko.category = updateFunkoDto.category
      return funko
    }
  }

  remove(id: number) {
    const funkoIndex = this.funkoList.findIndex((funko) => funko.id === id)
    this.funkoList.splice(funkoIndex, 1)
  }
}
