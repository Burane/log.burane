import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { withEnvironment } from '../extensions/with-environment';
import { withRootStore } from '../extensions/with-root-store';
import { PaginationResponse } from '../../types/PaginationType';
import { AppApi } from '../../services/api/app.api';
import { Result } from '../../services/api/api.types';
import {
  PaginationModel,
  PaginationQueryModel,
  PaginationQueryType,
  PaginationType,
} from '../genericModel/paginationModel';
import { ApplicationModel, ApplicationType } from './application.model';

const defaultPagination: PaginationType = {
  totalSize: 0,
  pageSize: 0,
  pageCount: 0,
  isNextPage: false,
  pageIndex: 0,
  isPreviousPage: false,
};
const defaultPaginationQuery: PaginationQueryType = {
  pagination: { pageIndex: 0, pageSize: 2 },
  search: undefined,
  sort: undefined,
};

let timeout: NodeJS.Timeout;

export const ApplicationStoreModel = types
  .model('ApplicationStore')
  .props({
    applications: types.optional(types.array(ApplicationModel), []),
    pagination: types.optional(PaginationModel, defaultPagination),
    isLoading: types.optional(types.boolean, false),
    shouldResetProduct: types.optional(types.boolean, false),
    paginationQuery: types.optional(
      PaginationQueryModel,
      defaultPaginationQuery,
    ),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .actions((self) => ({
    reset: () => {
      self.applications.splice(0, self.applications.length);
      self.pagination = defaultPagination;
      self.isLoading = false;
      self.shouldResetProduct = false;
      self.paginationQuery = defaultPaginationQuery;
    },
  }))
  .actions((self) => ({
    fetchData: flow(function* (paginationQuery?: PaginationQueryType) {
      self.isLoading = true;
      if (!paginationQuery) {
        paginationQuery = self.paginationQuery;
      }
      const appApi = new AppApi();
      const res: Result<PaginationResponse<ApplicationType>> =
        yield appApi.getApplications(paginationQuery);

      if (res.ok) {
        const { pagination, results } = res.data;
        self.pagination = pagination;
        if (paginationQuery?.search?.length ?? 0 > 0) {
          self.applications.replace(results);
        } else {
          if (self.shouldResetProduct) {
            self.applications.replace(results);
            self.shouldResetProduct = false;
          } else {
            // de base pour faire un infinite scroll
            // self.applications.replace(
            //   self.applications.concat(
            //     results.filter(
            //       (p) => !self.applications.some((p2) => p2.id === p.id),
            //     ),
            //   ),
            // );
            self.applications.replace(results);
          }
        }
      }
      self.isLoading = false;
    }),
  }))
  .actions((self) => ({
    setPaginationQuery: (paginationQuery: PaginationQueryType) => {
      self.paginationQuery = paginationQuery;
      self.fetchData();
    },
    setShouldResetApplications: (shouldResetProduct: boolean) => {
      self.shouldResetProduct = shouldResetProduct;
    },
  }))
  .actions((self) => ({
    searchApplications: (search: string) => {
      let isProductReset = false;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (self.paginationQuery?.search?.length ?? 0 > 0) {
          isProductReset = true;
        }

        if (isProductReset && search.length === 0) {
          self.setShouldResetApplications(true);
        }

        self.setPaginationQuery({
          ...self.paginationQuery,
          search: search,
          pagination: {
            pageSize: self.paginationQuery?.pagination?.pageSize,
            pageIndex: 0,
          },
        });
      }, 200);
    },

    fetchNextPage: () => {
      if (self.pagination?.isNextPage)
        self.setPaginationQuery({
          ...self.paginationQuery,
          pagination: {
            pageSize: self.paginationQuery?.pagination?.pageSize,
            pageIndex: self.pagination.pageIndex + 1,
          },
        });
    },
    fetchPage: (page: number) => {
      if (page >= 0 && page < self.pagination.pageCount)
        self.setPaginationQuery({
          ...self.paginationQuery,
          pagination: {
            pageSize: self.paginationQuery?.pagination?.pageSize,
            pageIndex: page,
          },
        });
    },
  }));

type ApplicationStoreType = Instance<typeof ApplicationStoreModel>;
export interface ApplicationStore extends ApplicationStoreType {}
type ApplicationStoreSnapshotType = SnapshotOut<typeof ApplicationStoreModel>;
export interface ApplicationStoreSnapshot
  extends ApplicationStoreSnapshotType {}
export const createApplicationStoreDefaultModel = () =>
  types.optional(ApplicationStoreModel, {});
