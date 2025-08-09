import axios from 'axios'
import constants from '../configs/constants'

const tokenStorage = localStorage.getItem('app.auth.token')
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
    if (error.response.status === 403 || localStorage.getItem('token') === null) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    } else if (error.request.status >= 500) {
      return Promise.reject(error)
    }
  }
)

export const setHeaders = (token: string) => {
  fetcher.defaults.headers.common['token'] = token
  fetcherRawResponse.defaults.headers.common['token'] = token
}

export const resetHeaders = () => {
  delete fetcher.defaults.headers.common['token']
  delete fetcherRawResponse.defaults.headers.common['token']
}

if (token) setHeaders(token)