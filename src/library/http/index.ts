import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse} from 'axios'
import { localStorageOperator } from '../storage'

const refreshToken = () => axios.post('/refresh-token')

interface RequestInfo {
  url: string
}

const queue: RequestInfo[] = []
let isRefreshing = false

const authInstance = axios.create({})

const requestSuccess = (config: InternalAxiosRequestConfig) => {
  const token = localStorageOperator.getItem('token')
  config.headers['Authorization'] = `Bearer ${token}`
  return Promise.resolve(config)
}
const requestError = (error: AxiosError) => {
  return Promise.reject(error)
}
const responseSuccess = (config: AxiosResponse) => {
  return Promise.resolve(config)
}
const responseError = (error: AxiosError) => {
  if (error.response) {
    const { status, config } = error.response
    if (status === 401) {
      localStorageOperator.removeItem('token')
      queue.push({ url: config.url! })
      if (isRefreshing) return
      isRefreshing = true
      refreshToken().then((response) => {
        isRefreshing = false
        localStorageOperator.setItem('token', response.data.token)
        queue.forEach((request) => {
          authInstance({ url: request.url })
        })
      })
    }
  }
  return Promise.reject(error)
}

authInstance.interceptors.request.use(requestSuccess, requestError)
authInstance.interceptors.response.use(responseSuccess, responseError)

export { authInstance }