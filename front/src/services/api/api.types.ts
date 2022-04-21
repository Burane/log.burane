import { GeneralApiProblem } from "./api.problem"
import { User, UserWithAccessToken } from '../../types';

export type LoginResult = { kind: "ok", result: UserWithAccessToken} | GeneralApiProblem
export type RefreshTokenResult = { kind: "ok", result: UserWithAccessToken} | GeneralApiProblem
export type LogoutResult = { kind: "ok" } | GeneralApiProblem
export type ForgotPwdResult = { kind: "ok" } | GeneralApiProblem

export type GetUsersResult = { kind: "ok"; users: User[] } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
