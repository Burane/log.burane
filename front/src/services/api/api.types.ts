import { ApiProblem } from './api.problem';

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
