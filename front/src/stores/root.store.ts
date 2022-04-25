import { types, Instance, SnapshotOut } from 'mobx-state-tree';
import { UserStore, UserStoreModel } from './user/user.store';
import { AuthStore, AuthStoreModel } from './auth/auth.store';

export type RootStoreModel = Instance<typeof RootStore>;
export type RootStoreEnv = {
  userStore: UserStore;
  authStore: AuthStore;
};

export const RootStore = types.model('RootStore', {
  userStore: UserStoreModel,
  authStore: AuthStoreModel,
});

/**
 * The RootStore instance.
 */
export interface IRootStore extends Instance<typeof RootStore> {}

/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStore> {}
