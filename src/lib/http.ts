import qs from 'qs';
import Vue, { PluginFunction } from 'vue';

import axios, { AxiosError, AxiosRequestConfig, AxiosInstance } from 'axios';

// tslint:disable-next-line:no-shadowed-variable
export const http: IHttpInstance = (function http(): IHttpInstance {
  let instance = axios.create({

    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },

    transformRequest: [
      (data: any) => {
        if (!data) {
          return data;
        }

        // 如果是Form表单就直接跳过JSON转换
        if (data instanceof FormData) {
          return data;
        }

        return qs.stringify(data, {
          arrayFormat: 'brackets',
          strictNullHandling: false
        });
      }
    ]
  } as AxiosRequestConfig);

  // 处理发送数据到服务器前的一些配置
  instance.interceptors.request.use(
    function(request: any): any {

      // 可考虑增加版本号
      if (!/^(https?:)?\/\//.test(request.url) && !/^\/api/.test(request.url)) {
        request.url = `/api${request.url}`;
      }

      return request;
    },
    function(error: any): any {
      //
    }
  );

  // 处理接收服务器数据
  instance.interceptors.response.use(
    (response: any) => {

      if (response.status < 200 || response.status >= 300) {
        return Promise.reject(response.statusText);
      }
      // 服务器没有返回正确的JSON格式
      if (typeof response.data === 'string' && !response.data) {

        return Promise.reject('服务器没有响应正确的数据, 请检查参数是否正确。');
      }

      return Promise.resolve(response.data);
    },
    (error: AxiosError) => {

      if (error && error.response) {
        return Promise.reject({
          status: error.response.status,
          statusText: error.response.statusText
        });
      } else {
        return Promise.reject({ status: 500, statusText: '服务器故障' });
      }
    }
  );

  return instance as IHttpInstance;
})();

// 配置到Window全局空间中
window.http = http;

// tslint:disable-next-line:variable-name
let VueHttp = <IPlugin>function(vue: Vue, ins: AxiosInstance): void {
  if (VueHttp.installed) {
    return;
  }
  VueHttp.installed = true;

  if (!axios) {
    console.error('You have to install axios');
    return;
  }

  vue['axios'] = axios;

  // @ts-ignore
  Object.defineProperties(vue.prototype, {
    axios: {
      get(): AxiosInstance {
        return axios;
      }
    },

    $http: {
      get(): IHttpInstance {
        return http;
      }
    }
  });
};

export { VueHttp };
export default http;

export interface IHttpRequestConfig<P = any, T = any>
  extends AxiosRequestConfig {
  params?: P;
  data?: T;
}

type HttpOptions<
  T extends keyof IService,
  P extends keyof IService[T] | string
> = P extends keyof IService[T] ? IService[T][P] : P extends { [K in P]: infer U } ? U : never;

type HttpOptionsData<T extends keyof IService> = HttpOptions<T, 'data'>;
type HttpOptionsParams<T extends keyof IService> = HttpOptions<T, 'params'>;
type HttpOptionsResponse<T extends keyof IService> = HttpOptions<T, 'response'> | IResponse;

export interface IHttpPromise<T = any> extends Promise<T> {}

export interface IHttpInstance {
  request<P extends keyof IService = any>(
    config: IHttpRequestConfig<HttpOptionsParams<P>, HttpOptionsData<P>>
  ): IHttpPromise<HttpOptionsResponse<P>>;

  delete<P extends keyof IService = any>(
    url: P,
    config?: IHttpRequestConfig<HttpOptionsParams<P>, HttpOptionsData<P>>
  ): IHttpPromise<HttpOptionsResponse<P>>;

  head<P extends keyof IService = any>(
    url: P,
    config?: IHttpRequestConfig<HttpOptionsParams<P>, HttpOptionsData<P>>
  ): IHttpPromise<HttpOptionsResponse<P>>;

  get<T extends HttpOptionsResponse<P>, P extends keyof IService = any>(
    url: P,
    config?: IHttpRequestConfig<HttpOptionsParams<P>, HttpOptionsData<P>>
  ): IHttpPromise<T>;

  post<T extends HttpOptionsResponse<P>, P extends keyof IService>(
    url: P,
    data?: HttpOptionsData<P>,
    config?: IHttpRequestConfig<HttpOptionsParams<P>, HttpOptionsData<P>>
  ): IHttpPromise<T>;

  put<T extends HttpOptionsResponse<P>, P extends keyof IService = any>(
    url: P,
    data?: HttpOptionsData<P>,
    config?: IHttpRequestConfig<HttpOptionsParams<P>, HttpOptionsData<P>>
  ): IHttpPromise<T>;

  patch<T extends HttpOptionsResponse<P>, P extends keyof IService = any>(
    url: P,
    data?: HttpOptionsData<P>,
    config?: IHttpRequestConfig<HttpOptionsParams<P>, HttpOptionsData<P>>
  ): IHttpPromise<T>;
}

export interface IPlugin extends PluginFunction<any> {
  (vue: Vue, axios: AxiosInstance): void;
  installed: boolean;
}

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    http: IHttpInstance;
  }
}

declare module 'vue/types/vue' {
  // tslint:disable-next-line:interface-name
  interface Vue {
    axios: AxiosInstance;
    $http: IHttpInstance;
  }
}
