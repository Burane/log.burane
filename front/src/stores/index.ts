import { RootStore, RootStoreEnv, RootStoreModel } from './root.store';
import { UserStoreModel } from './user/user.store';
import { AuthStoreModel } from './auth/auth.store';

export const createStore = (): RootStoreModel => {
  const userStore = UserStoreModel.create();
  const authStore = AuthStoreModel.create();

  const env: RootStoreEnv = { userStore, authStore };

  const rootStore = RootStore.create(
    {
      userStore,
      authStore,
    },
    env,
  );

  return rootStore;
};
