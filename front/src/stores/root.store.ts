import { types, Instance, SnapshotOut } from 'mobx-state-tree';
import { UserStore, UserStoreModel } from './user/user.store';
import { AuthStore, AuthStoreModel } from './auth/auth.store';
import { isFunction } from 'lodash';

export type RootStoreModel = Instance<typeof RootStore>;
export type RootStoreEnv = {
  userStore: UserStore;
  authStore: AuthStore;
};

export const RootStore = types
  .model('RootStore', {
    userStore: UserStoreModel,
    authStore: AuthStoreModel,
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
  }));

/**
 * The RootStore instance.
 */
export interface IRootStore extends Instance<typeof RootStore> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStore> {}
