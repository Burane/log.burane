import { types, Instance } from 'mobx-state-tree';
import { UserStore, UserStoreModel } from './user/user.store';

export type RootStoreModel = Instance<typeof RootStore>;
export type RootStoreEnv = {
  userStore: UserStore;
};

const RootStore = types.model('RootStore', {
  userStore: UserStoreModel,
});

export default RootStore;
