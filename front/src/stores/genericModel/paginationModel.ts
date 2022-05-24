import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const PaginationModel = types.model('Pagination').props({
  totalSize: types.number,
  pageSize: types.number,
  pageCount: types.number,
  pageIndex: types.number,
  isNextPage: types.boolean,
  isPreviousPage: types.boolean,
});
export type PaginationType = Instance<typeof PaginationModel>;
export interface Pagination extends PaginationType {}
export type PaginationSnapshotType = SnapshotOut<typeof PaginationModel>;
export interface PaginationSnapshot extends PaginationSnapshotType {}

export const createPaginationDefaultModel = () =>
  types.optional(PaginationModel, {
    pageSize: 0,
    pageIndex: 0,
    isPreviousPage: false,
    pageCount: 0,
    totalSize: 0,
    isNextPage: false,
  });

export const PaginationPageQueryModel = types.model('PaginationQuery').props({
  pageSize: types.maybe(types.number),
  pageIndex: types.maybe(types.number),
});
export type PaginationPageQueryType = Instance<typeof PaginationPageQueryModel>;
export interface PaginationPageQuery extends PaginationPageQueryType {}
export type PaginationPageQuerySnapshotType = SnapshotOut<
  typeof PaginationPageQueryModel
>;
export interface PaginationPageQuerySnapshot
  extends PaginationPageQuerySnapshotType {}
export const createPaginationPageQueryDefaultModel = () =>
  types.maybe(PaginationPageQueryModel);

export const orderByArray = ['asc', 'desc'];

export const PaginationSortQueryModel = types.model('PaginationQuery').props({
  sortBy: types.string,
  orderBy: types.enumeration(orderByArray),
});

export type PaginationSortQueryType = Instance<typeof PaginationSortQueryModel>;
export interface PaginationSortQuery extends PaginationSortQueryType {}
export type PaginationSortQuerySnapshotType = SnapshotOut<
  typeof PaginationSortQueryModel
>;
export interface PaginationSortQuerySnapshot
  extends PaginationSortQuerySnapshotType {}
export const createPaginationSortQueryDefaultModel = () =>
  types.maybe(PaginationSortQueryModel);

export const PaginationQueryModel = types.model('PaginationQuery').props({
  pagination: types.maybe(PaginationPageQueryModel),
  sort: types.maybe(types.array(PaginationSortQueryModel)),
  search: types.maybe(types.string),
});

export type PaginationQueryType = Instance<typeof PaginationQueryModel>;
export interface PaginationQuery extends PaginationQueryType {}
export type PaginationQuerySnapshotType = SnapshotOut<
  typeof PaginationQueryModel
>;
export interface PaginationQuerySnapshot extends PaginationQuerySnapshotType {}
export const createPaginationQueryDefaultModel = () =>
  types.optional(PaginationQueryModel, {});
