import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Trim } from '../decorator/trim.decorator';

export class Pagination {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(Number.MAX_SAFE_INTEGER)
  @Type(() => Number)
  pageIndex?: number;
}

export enum Order {
  asc = 'asc',
  desc = 'desc',
}

export class Sort {
  @IsString()
  @MaxLength(255)
  @Trim()
  sortBy: string;

  @IsEnum(Order)
  orderBy: Order;
}

export class PaginationResponse<T> {
  pagination: {
    totalSize: number;
    pageSize: number;
    pageCount: number;
    pageIndex: number;
    isNextPage: boolean;
    isPreviousPage: boolean;
  };
  results: T[];
}

export class PaginationQuery {
  @IsOptional()
  @ValidateNested()
  @Type(() => Pagination)
  pagination: Pagination;

  @IsOptional()
  @ValidateNested()
  @Type(() => Sort)
  sort: Sort[];

  @IsOptional()
  @MaxLength(255)
  @Trim()
  search: string;
}
