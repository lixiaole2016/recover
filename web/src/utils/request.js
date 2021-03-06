import axios from 'axios'
import { Dialog, Toast } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Qs from 'querystring'

const baseURL = 'http://localhost:7000'
// 创建一个axios实例
const service = axios.create({
  baseURL, // url = baseURL + request url
  // withCredentials: true, // 在跨域请求发送cookies
  timeout: 5000 // 请求超时
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 在请求发送前做点事情
    // 修改默认的content-type axios默认会发送json格式
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    // 转换data格式 axios默认发送的为json格式
    config.data = Qs.stringify(config.data)
    if (store.getters.token) {
      // 在请求头中携带token
      // Authorization 是携带token的请求头
      // please modify it according to the actual situation
      config.headers.Authorization = 'bearer ' + getToken()
    }
    return config
  },
  error => {
    // 请求出错时
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 10000, it is judged as an error.
    if (res.code !== 10000) {
      const defaultMessage = '服务器忙 稍后再试'
      const message = res.data ? res.data.message || defaultMessage : defaultMessage
      Dialog.alert({
        title: '提示',
        message
      })

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Toast(error.message)
    return Promise.reject(error)
  }
)

export default service
