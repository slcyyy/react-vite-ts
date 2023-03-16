import instance from './instance';
import type { AxiosRequestConfig } from 'axios';
// type Result<T> = {
//   code: number;
//   message: string;
//   data: T;
// };

export const get = async (url: string, params?: unknown, config?: AxiosRequestConfig) => {
  return instance
    .get(url, { params, ...config })
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      console.log('err', err);
      return [err, null];
    });
};

export const post = async (url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return instance
    .post(url, data, config)
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      console.log('err', err);
      return [err, null];
    });
};

export const put = async (url: string, data?: unknown, config?: AxiosRequestConfig) => {
  instance
    .put(url, data, config)
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      console.log('err', err);
      return [err, null];
    });
};

export const del = async (url: string, params?: unknown, config?: AxiosRequestConfig) => {
  return instance
    .delete(url, { params, ...config })
    .then((data) => {
      return [null, data];
    })
    .catch((err) => {
      console.log('err', err);
      return [err, null];
    });
};
