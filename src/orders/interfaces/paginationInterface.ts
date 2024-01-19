import { IPaginationOptions } from 'nestjs-typeorm-paginate'

export interface PaginationInterface extends IPaginationOptions {
  isDeleted?: boolean
}
