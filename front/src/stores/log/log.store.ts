import { cast, flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
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
import { LogMessageModel, LogMessageType } from './log.model';

const defaultPagination: PaginationType = {
  totalSize: 0,
  pageSize: 0,
  pageCount: 0,
  isNextPage: false,
  pageIndex: 0,
  isPreviousPage: false,
};
const defaultPaginationQuery: PaginationQueryType = {
  pagination: { pageIndex: 0, pageSize: 15 },
  search: undefined,
  sort: undefined,
};

let timeout: NodeJS.Timeout;

export const LogStoreModel = types
  .model('ApplicationStore')
  .props({
    logMessages: types.optional(types.array(LogMessageModel), []),
    pagination: types.optional(PaginationModel, defaultPagination),
    isLoading: types.optional(types.boolean, false),
    shouldReset: types.optional(types.boolean, false),
    paginationQuery: types.optional(
      PaginationQueryModel,
      defaultPaginationQuery,
    ),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .actions((self) => ({
    reset: () => {
      self.logMessages.splice(0, self.logMessages.length);
      self.pagination = defaultPagination;
      self.isLoading = false;
      self.shouldReset = false;
      self.paginationQuery = defaultPaginationQuery;
    },
  }))
  .actions((self) => ({
    fetchData: flow(function* (
      appId: string,
      paginationQuery?: PaginationQueryType,
    ) {
      if (!appId) return;
      self.isLoading = true;
      if (!paginationQuery) {
        paginationQuery = self.paginationQuery;
      }
      const appApi = new AppApi();
      const res: Result<PaginationResponse<LogMessageType>> =
        yield appApi.getApplicationsLogs(appId, paginationQuery);

      if (res.ok) {
        const { pagination, results } = res.data;
        self.pagination = pagination;
        if (paginationQuery?.search?.length ?? 0 > 0) {
          self.logMessages.replace(results);
        } else {
          if (self.shouldReset) {
            self.logMessages.replace(results);
            self.shouldReset = false;
          } else {
            // de base pour faire un infinite scroll
            // self.applications.replace(
            //   self.applications.concat(
            //     results.filter(
            //       (p) => !self.applications.some((p2) => p2.id === p.id),
            //     ),
            //   ),
            // );
            self.logMessages.replace(results);
          }
        }
      }
      self.isLoading = false;
    }),
  }))
  .actions((self) => ({
    setPaginationQuery: (
      appId: string,
      paginationQuery: PaginationQueryType,
    ) => {
      self.paginationQuery = paginationQuery;
      self.fetchData(appId);
    },
    setShouldReset: (shouldResetProduct: boolean) => {
      self.shouldReset = shouldResetProduct;
    },
  }))
  .actions((self) => ({
    searchLogs: (search: string, appId: string) => {
      let isProductReset = false;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (self.paginationQuery?.search?.length ?? 0 > 0) {
          isProductReset = true;
        }

        if (isProductReset && search.length === 0) {
          self.setShouldReset(true);
        }

        self.setPaginationQuery(appId, {
          ...self.paginationQuery,
          search: search,
          pagination: {
            pageSize: self.paginationQuery?.pagination?.pageSize,
            pageIndex: 0,
          },
        });
      }, 200);
    },

    fetchNextPage: (appId: string) => {
      if (self.pagination?.isNextPage)
        self.setPaginationQuery(appId, {
          ...self.paginationQuery,
          pagination: {
            pageSize: self.paginationQuery?.pagination?.pageSize,
            pageIndex: self.pagination.pageIndex + 1,
          },
        });
    },
    fetchPage: (page: number, appId: string) => {
      if (page >= 0 && page < self.pagination.pageCount)
        self.setPaginationQuery(appId, {
          ...self.paginationQuery,
          pagination: {
            pageSize: self.paginationQuery?.pagination?.pageSize,
            pageIndex: page,
          },
        });
    },
  }));

type LogStoreType = Instance<typeof LogStoreModel>;

export interface LogStore extends LogStoreType {}

type LogStoreSnapshotType = SnapshotOut<typeof LogStoreModel>;

export interface ApplicationStoreSnapshot extends LogStoreSnapshotType {}

export const createApplicationStoreDefaultModel = () =>
  types.optional(LogStoreModel, {});
