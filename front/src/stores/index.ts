import { RootStore, RootStoreEnv, RootStoreModel } from './root.store';
import { UserStoreModel } from './user/user.store';
import { AuthStoreModel } from './auth/auth.store';
import { LogStoreModel } from './log/log.store';
import { ApplicationStoreModel } from './application/application.store';

export const createStore = (): RootStoreModel => {
  const userStore = UserStoreModel.create();
  const authStore = AuthStoreModel.create();
  const appStore = ApplicationStoreModel.create();
  const logStore = LogStoreModel.create();

  const env: RootStoreEnv = { userStore, authStore, appStore, logStore };

  return RootStore.create(
    {
      userStore,
      authStore,
      appStore,
      logStore,
    },
    env,
  );
};
