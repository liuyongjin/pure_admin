import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let base_url;

if (process.env.NODE_ENV === 'production') {
  base_url = 'http://47.97.7.175:8081'
} else if (process.env.NODE_ENV === 'development') {
  base_url = 'http://47.97.7.175:8081'
}
// create an axios instance
const service = axios.create({
  baseURL: base_url, // api 的 base_url
  timeout: 5000 // request timeout
})



// request interceptor
service.interceptors.request.use(
  config => {
    if (config.url.indexOf('http') > -1) config.baseURL = ''
    // 部分接口timeout时间单独处理
    if (config.url.indexOf('SynThirdInfo') > -1 || config.url.indexOf('extend/Email/Receive') > -1 ||
      config.url.indexOf('Permission/Authority/Data') > -1 || config.url.indexOf('DataSync/Actions/Execute') > -1) {
      config.timeout = 100000
    }
    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    if (config.method == 'get') {
      config.params = config.data
    }
    let timestamp = Date.parse(new Date()) / 1000
    if (config.url.indexOf('?') > -1) {
      config.url += `&n=${timestamp}`
    } else {
      config.url += `?n=${timestamp}`
    }
    return config
  },
  error => {
    // do something with request error
    if (process.env.NODE_ENV === 'development') {
      console.log(error) // for debug
    }
    return Promise.reject(error)
  }
)


// response interceptor
service.interceptors.response.use(
  response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
