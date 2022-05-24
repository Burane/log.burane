import { ApiProblem } from './api.problem';

export type User = {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type UserWithAccessToken = {
  accessToken: string;
  user: User;
};

export interface Credentials {
  email: string;
  password: string;
}

export type EmptyObject = {
  [K in any]: never;
};

export type ResultOk<T> = {
  ok: true;
  data: T;
};

export type ResultError = {
  ok: false;
  data: ApiProblem;
};

export type Result<T> = ResultOk<T> | ResultError;
