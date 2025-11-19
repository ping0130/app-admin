import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// 创建 Axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
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

    if (res.code && res.code !== 200) {
      handleCustomErrorCode(res.code, res.message)
      return Promise.reject(new Error(res.message || 'Error'))
    }

    return res
  },
  error => {
    console.error('响应异常:', error)

    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          ElMessage.error('未授权，请先登录')
          break
        case 403:
          if (data.code === 40301 || data.message?.includes('过期')) {
            // token 过期或无权限，直接登出并跳转登录页
            store.dispatch('user/resetToken').then(() => {
              router.push('/login')
            })
          } else {
            ElMessage.error('权限不足，无法访问该资源')
          }
          break
        case 500:
          ElMessage.error(data.message || '服务器内部错误')
          break
        default:
          ElMessage.error(data.message || `错误（状态码：${status}）`)
      }
    } else {
      ElMessage.error(error.message || '网络异常，请检查连接')
    }

    return Promise.reject(error)
  }
)

// 封装的自定义状态码处理函数
function handleCustomErrorCode(code, message) {
  switch (code) {
    case 401:
      ElMessage.error('您尚未登录，请先登录')
      break
    case 40301:
      store.dispatch('user/resetToken').then(() => {
        router.push('/login')
      })
      break
    case 403:
      ElMessage.error('权限不足，无法访问该功能')
      break
    default:
      ElMessage.error(message || '请求错误')
  }
}

export default service
