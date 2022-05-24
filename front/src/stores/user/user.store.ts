import { Instance, SnapshotOut, types } from 'mobx-state-tree';

export const roleArray = ['USER', 'ADMIN', 'SUPERADMIN'];

export const UserStoreModel = types
  .model('UserStore')
  .props({
    id: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
    role: types.optional(types.enumeration(roleArray), 'USER'),
    createdAt: types.optional(types.string, ''),
    updatedAt: types.optional(types.string, ''),
  })
  .actions((self) => ({
    saveUser: (newUser: UserSnapshot): void => {
      self.id = newUser.id;
      self.email = newUser.email;
      self.role = newUser.role;
      self.createdAt = newUser.createdAt;
      self.updatedAt = newUser.updatedAt;
    },

    reset: () => {
      self.id = '';
      self.email = '';
      self.role = '';
      self.createdAt = '';
      self.updatedAt = '';
    },
  }))
  .actions((self) => ({
    getUser: (): UserSnapshot => {
      return {
        id: self.id,
        email: self.email,
        role: self.role,
        createdAt: self.createdAt,
        updatedAt: self.updatedAt,
      };
    },
  }));

export type UserType = Instance<typeof UserStoreModel>;
export interface User extends UserType {}
export type UserSnapshotType = SnapshotOut<typeof UserStoreModel>;
export interface UserSnapshot extends UserSnapshotType {}
export const createUserDefaultModel = () => types.optional(UserStoreModel, {});
