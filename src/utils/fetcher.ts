import axios from 'axios'
import constants from '../configs/constants'

const tokenStorage = sessionStorage.getItem('app.auth.token')
const token = tokenStorage && JSON.parse(tokenStorage)

export const fetcher = axios.create({
  baseURL: constants.API_URL,
})

export const fetcherRawResponse = axios.create({
  baseURL: constants.API_URL,
})

fetcher.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error?.response?.status
    if (status === 401 || status === 403) {
      try { sessionStorage.removeItem('app.auth.token') } catch {}
      try { sessionStorage.removeItem('app.auth.role') } catch {}
      resetHeaders()
      const path = window.location.pathname

      if (path !== '/' && path !== '/login') {
        window.location.href = '/login'
      }
    }
    if (error?.request?.status >= 500) {
      return Promise.reject(error)
    }
    return Promise.reject(error)
  }
)

export const setHeaders = (token: string) => {
  fetcher.defaults.headers.common['Authorization'] = `Bearer ${token}`
  fetcherRawResponse.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const resetHeaders = () => {
  delete fetcher.defaults.headers.common['Authorization']
  delete fetcherRawResponse.defaults.headers.common['Authorization']
  delete fetcher.defaults.headers.common['token']
  delete fetcherRawResponse.defaults.headers.common['token']
}

if (token) setHeaders(token)