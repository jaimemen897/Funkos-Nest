import { v4 as uuidv4 } from 'uuid'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator'
import { Funko } from '../../funkos/entities/funko.entity'

@Entity({ name: 'categories' })
export class Category {
  @PrimaryColumn({ type: 'uuid' })
  @IsUUID('4', { message: 'El id debe ser un UUID' })
  id: uuidv4 = uuidv4()
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsNotEmpty({ message: 'El nombre no debe estar vacío' })
  name: string
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsDate({ message: 'La fecha de creación debe ser una fecha' })
  createdAt: Date
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @IsDate({ message: 'La fecha de actualización debe ser una fecha' })
  updatedAt: Date
  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  @IsBoolean({ message: 'El campo isDeleted debe ser un booleano' })
  @IsNotEmpty({ message: 'El campo isDeleted no debe estar vacío' })
  isDeleted: boolean
  @OneToMany(() => Funko, (funko) => funko.category)
  funkos: Funko[]
}
