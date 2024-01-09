import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Category } from '../../category/entities/category.entity'

@Entity({ name: 'funkos' })
export class Funko {
  public static IMAGE_DEFAULT = 'default.jpg'
  @PrimaryGeneratedColumn({ type: 'int' })
  @IsNumber({}, { message: 'El id debe ser un número' })
  id: number
  @Column('varchar', { length: 255, nullable: false, name: 'name' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  @IsString({ message: 'El nombre debe ser un string' })
  name: string
  @Column('decimal', { precision: 5, scale: 2, nullable: false, name: 'price' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  price: number
  @Column('varchar', { length: 255, nullable: false, name: 'stock' })
  @IsPositive({ message: 'El stock debe ser positivo' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  stock: number
  @Column('varchar', { length: 255, nullable: false, name: 'image' })
  @IsNotEmpty({ message: 'La imagen no debe estar vacía' })
  @IsString({ message: 'La imagen debe ser un string' })
  image: string = Funko.IMAGE_DEFAULT
  @IsNotEmpty({ message: 'La categoría no debe estar vacía' })
  @ManyToOne(() => Category, (category) => category.funkos)
  @JoinColumn({ name: 'category_id' })
  category: Category
}
