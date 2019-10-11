// 封装axios
import axios from 'axios'
import JSONbig from 'json-bigint'

// 之前是这样写的
// axios.default.baseURL = 'xxx
// axios.create方法返回一个请求对象，这个请求对象的功能和axios功能一样
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn'
})
// 配置处理后端返回数据中超出js安全整数范围问题
request.defaults.transformRequest = [function (data) {
  return data ? JSONbig.parse(data) : {}
}]
/*
* 请求拦截器
*/
/*
*响应拦截器
 */

// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
