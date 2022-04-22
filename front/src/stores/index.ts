import RootStore, { RootStoreModel, RootStoreEnv } from './root.store';
import { UserStore, UserStoreModel } from './user/user.store';

export const createStore = (): RootStoreModel => {
  const userStore = UserStoreModel.create();

  const env: RootStoreEnv = { userStore };

  const rootStore = RootStore.create(
    {
      userStore,
    },
    env,
  );

  return rootStore;
};
