import request from '@/utils/request.js'

/**
 * GET 请求示例 (用于获取数据，参数会拼在 URL 的 ? 后面)
 * @param {Object} params 查询参数，例如 { page: 1, size: 10 }
 */
export const chat = (data) => {
  return request({
    url: '/api/chat', // 替换为真实的 GET 接口地址
    method: 'post',
    data // 注意：GET 请求传参一定要使用 params 字段
  })
}

/**
 * POST 请求示例 (用于提交数据，参数放在 Request Body 中)
 * @param {Object} data 提交的数据，例如 { name: '张三', age: 18 }
 */
export const postExample = (data) => {
  return request({
    url: '/api/example/add', // 替换为真实的 POST 接口地址
    method: 'post',
    data // 注意：POST/PUT 请求传参要使用 data 字段
  })
}
