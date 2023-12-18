import { Transform } from 'class-transformer'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCategoryDto {
  @Transform(({ value }) => value.trim().toUpperCase())
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string
}
