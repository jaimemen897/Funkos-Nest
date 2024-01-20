import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFunkoDto {
  @ApiProperty({
    example: 'Funko de Batman',
    description: 'Nombre del Funko',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @Transform(({ value }) => value.trim())
  name: string

  @ApiProperty({
    example: 5,
    description: 'Precio del Funko',
    minimum: 0,
  })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  price: number

  @ApiProperty({
    example: 8,
    description: 'Stock del Funko',
    minimum: 0,
  })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @IsPositive({ message: 'El stock debe ser positivo' })
  stock: number

  @ApiProperty({
    example: 'https://example.com/imagen.jpg',
    description: 'Imagen del Funko',
  })
  @IsString({ message: 'La imagen debe ser un string' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  image?: string

  @ApiProperty({
    example: 'DC',
    description: 'Categoría del Funko',
  })
  @IsString({ message: 'La categoría debe ser un string' })
  @IsNotEmpty({ message: 'La categoría no debe estar vacía' })
  category: string
}
