import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { withStatus } from '../extensions/with-status';
import { withEnvironment } from '../extensions/with-environment';
import { Api } from '../../services/api/api';

import { withRootStore } from '../extensions/with-root-store';
import { Credentials } from '../../types';
import { LoginResult, LogoutResult } from '../../services/api/api.types';

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

      const response: LoginResult = yield authAPI.login(credentials);

      if (response.kind === 'ok') {
        self.setStatus('done');
        self.setAuthenticated(true);
        self.rootStore.userStore.saveUser(response.result.user);
      } else {
        self.setStatus('error');
        self.setAuthenticated(false);
      }
      return response;
    }),

    logout: flow(function* () {
      self.setStatus('pending');

      const authAPI = new Api();
      const response: LogoutResult = yield authAPI.logout();

      console.log('response', response);
      self.rootStore.reset();

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
