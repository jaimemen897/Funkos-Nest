import { v4 as uuidv4 } from 'uuid'
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

export class Category {
  @PrimaryColumn({ type: 'uuid' })
  id: uuidv4
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean
}
