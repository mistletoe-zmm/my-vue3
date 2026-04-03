import axios from 'axios'
import { message } from 'ant-design-vue'

// 创建 axios 实例
const request = axios.create({
  // 根据当前执行所在的环境，自动读取对应的 baseURL (来自 .env 相关文件)
  baseURL: import.meta.env.VITE_APP_BASE_API || '', 
  timeout: 60000 // 请求超时时间 (10秒)
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    const status = error.response.status

    if (status === 403) {
      message.error(data.message || '拒绝访问')
    } else if (status === 401) {
      message.error(data.message || '当前未登录或登录已过期，请重新登录')
      // 可以在此处重定向至登录页并清除无用的 token
      // localStorage.removeItem('token')
      // location.href = '/login'
    } else if (status === 404) {
      message.error(`请求资源不存在: ${error.config.url}`)
    } else if (status >= 500) {
      message.error(data.message || '服务器端错误，请稍后再试')
    } else {
       message.error(data.message || error.message || '请求执行失败')
    }
  } else if (error.message && error.message.includes('timeout')) {
    message.error('网络请求超时，请重试')
  } else {
    message.error('网络连接错误，请检查网络')
  }
  return Promise.reject(error)
}

// 请求拦截器
request.interceptors.request.use((config) => {
  // 从 localStorage 或是 pinia 中获取 token
  const token = localStorage.getItem('token')
  
  // 如果存在 token，将它添加到请求头中
  if (token) {
    // 根据后端的具体要求设置请求头 (有些是 token，有些是 Bearer token 等)
    config.headers['Authorization'] = `Bearer ${token}`
  }
  
  return config
}, errorHandler)

// 响应拦截器
request.interceptors.response.use((response) => {
  const { data } = response
  
  // 这里的 data.code 根据后端的实际返回数据结构进行调整
  // 假设后端返回的数据结构总是 { code: 200, data: {...}, message: "success" }
  if (data && data.code !== undefined && data.code !== 200) {
    // 业务级别的错误处理
    message.error(data.message || '操作失败')
    
    // 处理特定的业务码，比如 token 失效时的自定义 code
    if (data.code === 401 || data.code === 4001) {
      // 触发登出操作...
    }
    
    // 如果后续还需要 catch 到错误，向下返回 reject
    return Promise.reject(new Error(data.message || '请求错误'))
  }
  
  // 请求成功，通常前端只关心业务数据部分，因此直接返回
  // 如果后端没有特定包装，就根据情况返回 response 或是 response.data
  return data
}, errorHandler)

// 导出一个便于调用的对象或者直接导出实例也可以
export const get = (url, params, config = {}) => request.get(url, { params, ...config })
export const post = (url, data, config = {}) => request.post(url, data, config)
export const put = (url, data, config = {}) => request.put(url, data, config)
export const del = (url, params, config = {}) => request.delete(url, { params, ...config })

export default request
