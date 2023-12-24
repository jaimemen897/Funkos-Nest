import { Injectable } from '@nestjs/common'
import { Category } from '../entities/category.entity'
import { CategoryResponseDto } from '../dto/category-response.dto'

@Injectable()
export class CategoryMapper {
  mapToResponseDto(entity: Category): CategoryResponseDto {
    return { ...entity }
  }
}
