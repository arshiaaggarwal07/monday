// frontend/src/api/client.ts

import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})


// Refresh token handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    const original = error.config

    const isRefreshCall =
      original?.url?.includes('/auth/refresh')


    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isRefreshCall
    ) {

      original._retry = true

      try {

        const { data } = await axios.post(
          '/api/auth/refresh',
          {},
          {
            withCredentials: true
          }
        )

        localStorage.setItem(
          'accessToken',
          data.accessToken
        )

        original.headers.Authorization =
          `Bearer ${data.accessToken}`

        return api(original)

      } catch {

        localStorage.removeItem('accessToken')
        window.location.href = '/auth'

      }
    }

    return Promise.reject(error)
  }
)

export default api