import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({
    example: 'DC',
    description: 'Category name',
  })
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string
}
