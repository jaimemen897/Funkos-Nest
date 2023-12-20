import { Injectable } from '@nestjs/common'
import { Funko } from '../entities/funko.entity'
import { CreateFunkoDto } from '../dto/create-funko.dto'
import { UpdateFunkoDto } from '../dto/update-funko.dto'
import { ResponseFunkoDto } from '../dto/response-funko.dto'
import { Category } from '../../category/entities/category.entity'
import { plainToClass } from 'class-transformer'

@Injectable()
export class FunkosMapper {
  mapToEntityCreateDto(dto: CreateFunkoDto, category: Category): Funko {
    const funko = plainToClass(Funko, dto)
    funko.category = category
    return funko
  }

  mapToEntityUpdateDto(dto: UpdateFunkoDto, category: Category): Funko {
    const funko = plainToClass(Funko, dto)
    funko.category = category
    return funko
  }

  mapToResponseDto(entity: Funko): ResponseFunkoDto {
    const dto = plainToClass(ResponseFunkoDto, entity)
    if (entity.category && entity.category.name) {
      dto.category = entity.category.name
    } else {
      dto.category = null
    }
    return dto
  }
}
