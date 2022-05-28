export type PaginationQ = {
  pageSize?: number;

  pageIndex?: number;
};

export type PaginationR = {
  totalSize: number;
  pageSize: number;
  pageCount: number;
  pageIndex: number;
  isNextPage: boolean;
  isPreviousPage: boolean;
};

export enum Order {
  asc = 'asc',
  desc = 'desc',
}

export type Sort = {
  sortBy: string;

  orderBy: Order;
};

export type PaginationResponse<T> = {
  pagination: PaginationR;

  results: T[];
};

export type PaginationQuery = {
  pagination?: PaginationQ;

  sort?: Sort[];

  search?: string;
};
