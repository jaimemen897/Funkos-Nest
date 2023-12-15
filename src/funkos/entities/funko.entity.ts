import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator'

export enum Category {
  DISNEY = 'Disney',
  MARVEL = 'Marvel',
  DC = 'DC',
  OTROS = 'Otros',
}

export class Funko {
  private static idCount: number = 1

  @IsNumber({}, { message: 'El id debe ser un número' })
  id: number
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @IsString({ message: 'El nombre debe ser un string' })
  name: string
  @IsPositive({ message: 'El precio debe ser positivo' })
  price: number
  @IsPositive({ message: 'El stock debe ser positivo' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number
  @IsNotEmpty({ message: 'La categoría no debe estar vacía' })
  @IsEnum(Category)
  category: Category

  constructor() {
    this.id = Funko.idCount++
  }
}
