import { Api } from './api';
import { ApiProblem } from './api.problem';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Result } from './api.types';
import { PaginationResponse } from '../../types/PaginationType';
import qs from 'qs';
import { ApiConfig } from './api.config';
import { ApplicationType } from '../../stores/application/application.model';
import { PaginationQueryType } from '../../stores/genericModel/paginationModel';

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
}
