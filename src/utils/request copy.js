import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建 Axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 后端 API 基础路径
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = getToken() || store.getters.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    } else {
      console.warn('No Token provided')
    }
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data

    // 检查后端返回的状态码
    if (res.code && res.code !== 200) {
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.code === 401 || res.code === 403) {
        ElMessageBox.confirm(
          '您的会话已过期,请重新登录.',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  error => {
    console.error('Response error:', error)

    if (error.response) {
      const { status, data } = error.response
      if (status === 401) {
        ElMessage({
          message: '未授权，请登录.',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (status === 500) {
        ElMessage({
          message: data.message || 'Internal Server Error',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        ElMessage({
          message: data.message || `Error: ${status}`,
          type: 'error',
          duration: 5 * 1000
        })
      }
    } else {
      ElMessage({
        message: error.message || 'Network Error',
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
