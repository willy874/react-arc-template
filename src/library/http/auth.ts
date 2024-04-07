import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { localStorageOperator } from '../storage';

const refreshToken = () => axios.post('/refresh-token');

interface RequestInfo {
  url: string;
}

export function createAuthInstance() {
  const queue: RequestInfo[] = [];
  let isRefreshing = false;

  const instance = axios.create({});

  const requestSuccess = (config: InternalAxiosRequestConfig) => {
    const token = localStorageOperator.getItem('token');
    config.headers['Authorization'] = `Bearer ${token}`;
    return Promise.resolve(config);
  };
  const requestError = (error: AxiosError) => {
    return Promise.reject(error);
  };
  const responseSuccess = (config: AxiosResponse) => {
    return Promise.resolve(config);
  };
  const responseError = (error: AxiosError) => {
    if (error.response) {
      const { status, config } = error.response;
      if (status === 401) {
        localStorageOperator.removeItem('token');
        queue.push({ url: config.url! });
        if (isRefreshing) return;
        isRefreshing = true;
        refreshToken().then((response) => {
          isRefreshing = false;
          localStorageOperator.setItem('token', response.data.token);
          queue.forEach((request) => {
            instance({ url: request.url });
          });
        });
      }
    }
    return Promise.reject(error);
  };

  instance.interceptors.request.use(requestSuccess, requestError);
  instance.interceptors.response.use(responseSuccess, responseError);

  return instance;
}
