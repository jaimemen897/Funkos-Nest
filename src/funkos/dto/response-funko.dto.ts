import { PartialType } from '@nestjs/mapped-types'
import { Funko } from '../entities/funko.entity'

export class ResponseFunkoDto extends PartialType(Funko) {}
