import { Injectable } from '@nestjs/common'
import { Funko } from '../entities/funko.entity'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { ResponseFunkoDto } from '../dto/response-funko.dto'

@Injectable()
export class FunkosMapper {
  mapToEntityCreateDto(dto: CreateFunkoDto): Funko {
    const funko = new Funko()
    return { ...dto, ...funko }
  }

  mapToEntityUpdateDto(dto: UpdateFunkoDto, entity: Funko) {
    return { ...entity, ...dto }
  }

  mapToResponseDto(entity: Funko): ResponseFunkoDto {
    return { ...entity, category: entity.category.name }
  }
}
