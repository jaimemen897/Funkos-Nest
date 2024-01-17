import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator'

export class AddressDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  number: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  street: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  city: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  state: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  country: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  zipCode: string
}

export class ClientDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  fullName: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  email: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  phoneNumber: string

  @IsNotEmpty()
  address: AddressDto
}

export class OrderLineDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  quantity: number

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  idFunko: string

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  price: number

  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  total: number
}

export class CreateOrderDto {
  @IsString()
  @MaxLength(50)
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
