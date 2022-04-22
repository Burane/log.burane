import { ApiResponse, ApisauceInstance, create } from 'apisauce';
import { getGeneralApiProblem } from './api.problem';
import { ApiConfig, DEFAULT_API_CONFIG } from './api.config';
import * as Types from './api.types';
import { ForgotPwdResult, GetUserResult, LogoutResult, RefreshTokenResult } from './api.types';
import { Credentials, User, UserWithAccessToken } from '../../types';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance;

  /**
   * Configurable options.
   */
  config: ApiConfig;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    });

    createAuthRefreshInterceptor(
      // @ts-ignore
      this.apisauce.axiosInstance,
      async (failedRequest: any) => {
        const refreshTokenResult = await this.refreshToken();
        if (refreshTokenResult.kind === 'ok') {
          localStorage.setItem('accessToken', refreshTokenResult.result.accessToken);
        } else {
          await this.logout();
        }
      },
    );


    this.apisauce.addAsyncRequestTransform(async (request) => {
      const accessToken = await localStorage.getItem('accessToken');
      if (!accessToken) return;
      request.headers.Authorization = `Bearer ${accessToken}`;
    });
  }


  async login(credentials: Credentials): Promise<Types.LoginResult> {
    const response: ApiResponse<any> = await this.apisauce.post('/auth/login', credentials);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    try {
      const resultUser: UserWithAccessToken = {
        accessToken: response.data.accessToken,
        user: response.data.user,
      };
      return { kind: 'ok', result: resultUser };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async logout(): Promise<LogoutResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/auth/logout');

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    localStorage.removeItem('accessToken');

    return { kind: 'ok' };
  }

  async forgotPassword(email: string): Promise<ForgotPwdResult> {
    const response: ApiResponse<any> = await this.apisauce.post('/auth/forgotPassword', { email });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return { kind: 'ok' };
  }

  async refreshToken(): Promise<RefreshTokenResult> {
    const response: ApiResponse<any> = await this.apisauce.get('/auth/refreshToken');

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    try {
      const resultUser: UserWithAccessToken = {
        accessToken: response.data.accessToken,
        user: response.data.user,
      };
      return { kind: 'ok', result: resultUser };
    } catch {
      return { kind: 'bad-data' };
    }
  }

  async getMySelf(): Promise<GetUserResult> {
    const response: ApiResponse<any> = await this.apisauce.get(`/auth/me`);

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    try {
      const resultUser: User = response.data;
      return { kind: 'ok', user: resultUser };
    } catch {
      return { kind: 'bad-data' };
    }
  }
}
