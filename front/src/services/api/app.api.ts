import { Api } from './api';
import { ApiProblem } from './api.problem';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Result } from './api.types';
import { PaginationResponse } from '../../types/PaginationType';
import qs from 'qs';
import { ApiConfig } from './api.config';
import { ApplicationType } from '../../stores/application/application.model';
import { PaginationQueryType } from '../../stores/genericModel/paginationModel';
import { LogMessageType } from '../../stores/log/log.model';

export class AppApi {
  axios!: AxiosInstance;

  config: ApiConfig;

  constructor(api?: Api) {
    if (!api) api = new Api();
    this.axios = api.axios;
    this.config = api.config;
  }

  async getApplications(
    paginationQuery?: PaginationQueryType,
  ): Promise<Result<PaginationResponse<ApplicationType>>> {
    try {
      const response = await this.axios.get<
        PaginationResponse<ApplicationType>
      >(
        paginationQuery
          ? `/applications?${qs.stringify(paginationQuery)}`
          : `/applications`,
      );

      const data = response.data;

      return { ok: true, data };
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

  async createApplication({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) {
    try {
      const response = await this.axios.post<ApplicationType>(
        'applications/create',
        { name, description },
      );

      const data = response.data;

      return { ok: true, data };
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

  async updateApplication({
    name,
    description,
    appId,
  }: {
    name: string;
    description: string;
    appId: string;
  }) {
    try {
      const response = await this.axios.patch<ApplicationType>(
        `applications/${appId}`,
        { name, description },
      );

      const data = response.data;

      return { ok: true, data };
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

  async deleteApplication({ id }: { id: string }) {
    try {
      const response = await this.axios.delete<ApplicationType>(
        `applications/${id}`,
      );

      const data = response.data;

      return { ok: true, data };
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

  async getApplicationsLogs(
    appId: string,
    paginationQuery?: PaginationQueryType,
  ): Promise<Result<PaginationResponse<LogMessageType>>> {
    try {
      const response = await this.axios.get<PaginationResponse<LogMessageType>>(
        paginationQuery
          ? `/applications/${appId}/logs?${qs.stringify(paginationQuery)}`
          : `/applications/${appId}/logs`,
      );

      const data = response.data;

      return { ok: true, data };
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
