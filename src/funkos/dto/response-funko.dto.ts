import { ApiProperty } from '@nestjs/swagger'

export class ResponseFunkoDto {
  @ApiProperty({
    description: 'Id del funko',
    example: 1,
  })
  id: number
  @ApiProperty({
    description: 'Nombre del funko',
    example: 'Funko de Batman',
  })
  name: string
  @ApiProperty({
    description: 'Precio del funko',
    example: 100,
  })
  price: number
  @ApiProperty({
    description: 'Cantidad de funkos',
    example: 10,
  })
  stock: number
  @ApiProperty({
    description: 'Imagen del funko',
    example: 'https://www.google.com',
  })
  image: string
  @ApiProperty({
    description: 'Categoria del funko',
    example: 'DC',
  })
  category: string
}
