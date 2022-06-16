import { ApiProblem } from './api.problem';
import { ApiConfig, DEFAULT_API_CONFIG } from './api.config';
import { Credentials, EmptyObject, Result } from './api.types';
import axios, { AxiosError, AxiosInstance } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh/src';
import { UserSnapshot } from '../../stores/user/user.store';

/**
 * Manages all requests to the API.
 */
export class Api {
  axios!: AxiosInstance;

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
    this.setup();
  }

  setup() {
    // construct the axios instance
    this.axios = axios.create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    createAuthRefreshInterceptor(
      this.axios,
      async (failedRequest: any) => {
        const refreshTokenResult = await this.refreshToken();
        if (refreshTokenResult.ok) {
          failedRequest.response.config.headers.Authorization =
            'Bearer ' + (await this.getAccessToken());
        } else {
          // unable to refresh token
          localStorage.removeItem('accessToken');
          window.location.reload();
        }
      },
      {
        shouldRefresh: (error: AxiosError<ApiProblem>) =>
          error?.response?.data?.message === 'jwt expired',
      },
    );

    this.axios.interceptors.request.use((request) => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken || !request.headers) return request;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return request;
    });
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  async login(credentials: Credentials): Promise<Result<UserSnapshot>> {
    try {
      const response = await this.axios.post<
        { user: UserSnapshot } & { accessToken: string }
      >('/auth/login', credentials);
      const { accessToken, user } = response.data;
      localStorage.setItem('accessToken', accessToken);
      return { ok: true, data: user };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }

  async logout(): Promise<Result<EmptyObject>> {
    try {
      await this.axios.get<EmptyObject>('/auth/logout');
      return { ok: true, data: {} };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }

  async register({
    password,
    passwordConfirmation,
    email,
  }: {
    password: string;
    passwordConfirmation: string;
    email: string;
  }): Promise<Result<EmptyObject>> {
    try {
      await this.axios.post<EmptyObject>('/auth/register', {
        password,
        passwordConfirmation,
        email,
      });
      localStorage.removeItem('accessToken');
      return { ok: true, data: {} };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }

  async forgotPassword({
    email,
  }: {
    email: string;
  }): Promise<Result<EmptyObject>> {
    try {
      await this.axios.post<EmptyObject>('/auth/forgotPassword', { email });

      return { ok: true, data: {} };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }

  async refreshToken(): Promise<Result<UserSnapshot>> {
    try {
      const response = await this.axios.get<
        { user: UserSnapshot } & { accessToken: string }
      >('/auth/refreshToken');
      const { accessToken, user } = response.data;
      await localStorage.setItem('accessToken', accessToken);
      return { ok: true, data: user };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }

  async resetPassword({
    password,
    passwordConfirmation,
    token,
  }: {
    password: string;
    passwordConfirmation: string;
    token: string;
  }): Promise<Result<UserSnapshot>> {
    try {
      const response = await this.axios.post<UserSnapshot>(
        `/auth/resetPassword`,
        {
          password,
          passwordConfirmation,
          token,
        },
      );
      return { ok: true, data: response.data };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }

  async getMySelf(): Promise<Result<UserSnapshot>> {
    try {
      const response = await this.axios.get<UserSnapshot>(`/auth/me`);
      const { data: user } = response;
      return { ok: true, data: user };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }
  async modifyAccount({
    email,
    username,
    userId,
  }: {
    email: string;
    username: string;
    userId: string;
  }): Promise<Result<UserSnapshot>> {
    try {
      const response = await this.axios.patch<UserSnapshot>(
        `/users/${userId}`,
        { email, username },
      );
      return { ok: true, data: response.data };
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        const axiosError = e as AxiosError<ApiProblem>;
        return {
          ok: false,
          data: axiosError?.response?.data ?? {
            message: 'unknown',
            statusCode: 500,
          },
        };
      }
      console.error(e);
      return { ok: false, data: { message: 'unknown', statusCode: 500 } };
    }
  }
}
