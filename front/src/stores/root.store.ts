import { types, Instance, SnapshotOut } from 'mobx-state-tree';
import { UserStore, UserStoreModel } from './user/user.store';
import { AuthStore, AuthStoreModel } from './auth/auth.store';
import { isFunction } from 'lodash';
import {
  ApplicationStore,
  ApplicationStoreModel,
} from './application/application.store';

export type RootStoreModel = Instance<typeof RootStore>;
export type RootStoreEnv = {
  userStore: UserStore;
  authStore: AuthStore;
  appStore: ApplicationStore;
};

export const RootStore = types
  .model('RootStore', {
    userStore: types.optional(UserStoreModel, {} as any),
    authStore: types.optional(AuthStoreModel, {} as any),
    appStore: types.optional(ApplicationStoreModel, {} as any),
  })
  .actions((self) => ({
    reset() {
      Object.values(self).forEach((item) => {
        if (
          item &&
          Object.prototype.hasOwnProperty.call(item, 'reset') &&
          isFunction(item.reset)
        )
          item.reset();
      });
    },
    fetchAllStore() {
      Object.values(self).forEach((item) => {
        if (
          item &&
          Object.prototype.hasOwnProperty.call(item, 'fetchData') &&
          isFunction(item.fetchData)
        )
          item.fetchData();
      });
    },
  }));

/**
 * The RootStore instance.
 */
export interface IRootStore extends Instance<typeof RootStore> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStore> {}
