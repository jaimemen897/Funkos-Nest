import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class AddressDto {
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  number: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  street: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  city: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  state: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  country: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  zipCode: string
}

export class ClientDto {
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  fullName: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  email: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  phoneNumber: string

  address: AddressDto
}

export class OrderLineDto {
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  quantity: number

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  idFunko: string

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  price: number

  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  total: number
}

export class CreateOrderDto {
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  idClient: string

  client: ClientDto

  orderLines: OrderLineDto[]

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  totalItems: number

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  total: number
}
