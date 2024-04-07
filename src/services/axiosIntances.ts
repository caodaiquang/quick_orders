import axios from 'axios'
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios'

import { apiRoutesEnum } from '@/enums/routes'
import LocalStorageService from '@/utils/index'
import EventEmitter from '@/utils/EventEmitter'

// For refreshing flow
let isRefreshing = false
const refreshTokenEmitter = new EventEmitter()

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = LocalStorageService.getLocalAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    return res
  },
  async (error: AxiosError) => {
    const originalConfig: AxiosRequestConfig = error.config
    if (
      originalConfig.url !== apiRoutesEnum.refreshToken &&
      error.response &&
      error.response.status === 401
    ) {
      if (!isRefreshing) {
        isRefreshing = true

        try {
          const refreshToken = LocalStorageService.getLocalRefreshToken()

          const result = await axiosInstance.post(apiRoutesEnum.refreshToken, {
            refreshToken
          })

          const { accessToken } = result.data.access
          LocalStorageService.saveLocalAccessToken(accessToken)

          // Emit event to channel for other know about it
          refreshTokenEmitter.emit('refresh', accessToken)
          // Remove all listener since all the receivers has received event
          refreshTokenEmitter.removeAllListener()

          return axiosInstance(originalConfig)
        } catch (error) {
          refreshTokenEmitter.emit('refresh', error)
          window.location.replace('/auth/login')
          // Remove all listener since all the receivers has received error
          refreshTokenEmitter.removeAllListener()
        } finally {
          isRefreshing = false
        }
      }
      // Wait for renew token process
      return new Promise<any>((resolve, reject) => {
        refreshTokenEmitter.addListener('refresh', (payload: string | Error) => {
          if (typeof payload === 'string') {
            originalConfig.headers.Authorization = `Bearer ${payload}`
            resolve(axiosInstance(originalConfig))
          } else if (payload instanceof Error) {
            reject(payload)
          }
          //   else {
          //     resolve()
          //   }
        })
      })
    }
    if (error.response && error.response.status === 400) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return new Promise<AxiosPromise<any> | void>((resolve, reject) => {
        reject(error.response.data)
      })
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
