// 封装axios
import axios from 'axios'
// import JSONbig from 'json-bigint'
import jsonBig from 'json-bigint'
// 非组件模块访问容器直接加载即可
// 这里得到的 store 和组件中访问的 this.$store 是一个东西
import store from '@/store'
// 之前是这样写的
// axios.default.baseURL = 'xxx
// axios.create方法返回一个请求对象，这个请求对象的功能和axios功能一样
const request = axios.create({
  // 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn'
})
// 配置处理后端返回数据中超出js安全整数范围问题
request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {} // 换了一个转化方法 使得 计算更精确 保证id不失真
}]
/*
* 请求拦截器
*/
request.interceptors.request.use(function (config) {
  // 在发起请求请做一些业务处理
  // config是要发送请求的配置信息
  const user = store.state.user
  if (user) {
    // Authorization 是后端要求的名字，不能瞎写
    // 数据值 "Bearer空格token" 也是后端要求的数据格式，不能瞎写
    // 千万!千万!千万!注意，Bearer 和 token 之间的空格不能少
    // 什么意义？这是后端要求的，我们决定不了。
    config.headers['Authorization'] = `Bearer ${user.token}` // 统一注入token 到headers属性 因为所有接口要求的token格式是一样的
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
/*
*响应拦截器
 */

// 导出这个请求对象，哪里需要发请求，哪里就加载使用
export default request
