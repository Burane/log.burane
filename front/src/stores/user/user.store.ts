import { flow, Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Api } from '../../services/api/api';
import { Result } from '../../services/api/api.types';
import { withRootStore } from '../extensions/with-root-store';
import { withEnvironment } from '../extensions/with-environment';

export const roleArray = ['USER', 'ADMIN', 'SUPERADMIN'];

export const UserStoreModel = types
  .model('UserStore')
  .props({
    id: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    username: types.optional(types.string, ''),
    role: types.optional(types.enumeration(roleArray), 'USER'),
    createdAt: types.optional(types.string, ''),
    updatedAt: types.optional(types.string, ''),
  })
  .extend(withRootStore)
  .extend(withEnvironment)
  .actions((self) => ({
    saveUser: (newUser: UserSnapshot) => {
      self.id = newUser.id;
      self.email = newUser.email;
      self.username = newUser.username;
      self.role = newUser.role;
      self.createdAt = newUser.createdAt;
      self.updatedAt = newUser.updatedAt;
    },

    reset: () => {
      self.id = '';
      self.email = '';
      self.role = 'USER';
      self.createdAt = '';
      self.updatedAt = '';
    },
  }))
  .actions((self) => ({
    getUser: (): UserSnapshot => {
      return {
        id: self.id,
        email: self.email,
        username: self.username,
        role: self.role,
        createdAt: self.createdAt,
        updatedAt: self.updatedAt,
      };
    },
    modifyAccount: flow(function* ({
      email,
      username,
      userId,
    }: {
      email: string;
      username: string;
      userId: string;
    }) {
      const authAPI = new Api();

      const response: Result<UserSnapshot> = yield authAPI.modifyAccount({
        email,
        username,
        userId,
      });

      if (response.ok) {
        self.saveUser(response.data);
      }

      return response;
    }),
  }));

export type UserStoreType = Instance<typeof UserStoreModel>;
export interface UserStore extends UserStoreType {}
export type UserSnapshotType = SnapshotOut<typeof UserStoreModel>;
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserStoreModel, {});
