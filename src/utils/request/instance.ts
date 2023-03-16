import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { notification } from 'antd';

export const controller = new AbortController();

const instance: AxiosInstance = axios.create({ timeout: 10000 });

let cancelRequest = 0;
/**
 * @method 请求拦截
 */
instance.interceptors.request.use((config) => {
  // header增加token
  config.headers!.token = localStorage.getItem('token') || '';
  config.signal = controller.signal;
  console.log('cancelRequest', cancelRequest);
  if (cancelRequest) {
    controller.abort();
  }
  return config;
});

/**
 * @method 响应拦截
 */
instance.interceptors.response.use(
  (response) => {
    cancelRequest = 0;
    const { data } = response;
    // 后台接口自身的异常错误 0成功 1异常
    if (data.errorno) {
      const { message } = data;
      return Promise.reject(message);
    }
    return data;
  }, // 后端封装有自己的code
  (error) => {
    const { code } = error;
    if (code == 'ERR_CANCELED') {
      return Promise.reject({ code, message: '请求被阻止' });
    }
    const { status, statusText } = error.response;
    // 如果有一个请求401，那么其他请求都将被阻止
    if (status == '404') {
      cancelRequest = 1;
      notification.error({ message: '鉴权失败' });
    } else {
      notification.error({ message: `请求出错（${status}）` });
    }

    // 使用Promise.reject会被请求方法catch到
    return Promise.reject({ code, message: statusText });
  },
);

export default instance;
