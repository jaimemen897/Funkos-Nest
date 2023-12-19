import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateFunkoDto {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @Transform(({ value }) => value.trim())
  name: string
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  price: number
  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number
  @IsString({ message: 'La categoría debe ser un string' })
  @IsNotEmpty({ message: 'La categoría no debe estar vacía' })
  category: string
}
