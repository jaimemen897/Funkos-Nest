import { Injectable } from '@nestjs/common'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { Category } from '../entities/category.entity'

@Injectable()
export class CategoryMapper {
  mapToEntityCreateDto(dto: CreateCategoryDto): Category {
    const category = new Category()
    return { ...dto, ...category }
  }

  mapToEntityUpdateDto(dto: CreateCategoryDto, entity: Category) {
    return { ...entity, ...dto }
  }

  mapToResponseDto(entity: Category): Category {
    return { ...entity }
  }
}
