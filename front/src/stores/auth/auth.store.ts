import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { withStatus } from '../extensions/with-status';
import { withEnvironment } from '../extensions/with-environment';
import { Api } from '../../services/api/api';

import { withRootStore } from '../extensions/with-root-store';
import { Credentials } from '../../types';
import { EmptyObject, Result } from '../../services/api/api.types';
import { UserSnapshot } from '../user/user.store';

/**
 * Model description here for TypeScript hints.
 */
export const AuthStoreModel = types
  .model('AuthStore')
  .props({
    isAuthenticated: types.optional(types.boolean, false),
  })
  .extend(withEnvironment)
  .extend(withStatus)
  .extend(withRootStore)
  .actions((self) => ({
    setAuthenticated(value: boolean) {
      self.isAuthenticated = value;
    },
    reset() {
      self.isAuthenticated = false;
    },
  }))
  .actions((self) => ({
    login: flow(function* (credentials: Credentials) {
      self.setStatus('pending');

      const authAPI = new Api();

      const response: Result<UserSnapshot> = yield authAPI.login(credentials);

      if (response.ok) {
        self.setStatus('done');
        self.setAuthenticated(true);
        self.rootStore.userStore.saveUser(response.data);
        self.rootStore.fetchAllStore();
      }
      if (!response.ok) {
        self.setStatus('error');
        self.setAuthenticated(false);
      }

      return response;
    }),

    logout: flow(function* () {
      self.setStatus('pending');

      const authAPI = new Api();
      const response: Result<EmptyObject> = yield authAPI.logout();

      self.rootStore.reset();
      localStorage.removeItem('accessToken');

      self.setStatus('done');
      return response;
    }),

    forgotPassword: flow(function* () {
      console.log('forgotPassword');
    }),
  }));

type AuthStoreType = Instance<typeof AuthStoreModel>;

export interface AuthStore extends AuthStoreType {}

type AuthStoreSnapshotType = SnapshotOut<typeof AuthStoreModel>;

export interface AuthStoreSnapshot extends AuthStoreSnapshotType {}

export const createAuthStoreDefaultModel = () =>
  types.optional(AuthStoreModel, {});
