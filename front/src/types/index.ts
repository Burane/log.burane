export type User = {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type UserWithAccessToken = {
  accessToken: string;
  user: User;
};

export type Credentials = {
  email: string;
  password: string;
};

export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
};

export type Role = typeof Role[keyof typeof Role];

export const roleArray: string[] = Object.values(Role)
  .filter((value) => typeof value === 'string')
  .map((value) => value as string);

export type RoleArray = typeof roleArray[number];
