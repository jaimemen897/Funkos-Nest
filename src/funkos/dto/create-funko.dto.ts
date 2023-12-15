import { Funko } from '../entities/funko.entity'
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator'

export class CreateFunkoDto {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  name: string
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  price: number
  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number
  @IsString({ message: 'La categoría debe ser un string' })
  category: Funko['category']
}
