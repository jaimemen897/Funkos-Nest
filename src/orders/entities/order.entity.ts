import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

export class Address {
  @Column()
  number: string
  @Column()
  street: string
  @Column()
  city: string
  @Column()
  state: string
  @Column()
  country: string
  @Column()
  zipCode: string
}

export class Client {
  @Column()
  fullName: string
  @Column()
  email: string
  @Column()
  phoneNumber: string
  @Column()
  address: Address
}

export class OrderLine {
  @Column()
  quantity: number
  @Column()
  idFunko: string
  @Column()
  price: number
  @Column()
  total: number
}

@Entity()
export class Order {
  @ObjectIdColumn()
  _id: ObjectId
  @Column()
  idClient: string
  @Column()
  client: Client
  @Column()
  orderLines: OrderLine[]
  @Column()
  totalItems: number
  @Column()
  total: number
  @Column()
  createdAt: Date
  @Column()
  updatedAt: Date
  @Column()
  isDeleted: boolean
}
