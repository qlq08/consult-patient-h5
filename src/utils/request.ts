// 二次封装axios
import { useUserStore } from '@/stores'
import axios from 'axios'
import { Toast } from 'vant'
// 1.axios的配置
// 1.1 创建一个新的axios实例，配置基准地址，配置响应超时时间
// 1.2 添加请求拦截器,在请求头携带token
// 1.3 添加响应拦截器,401错误拦截去登录页面,判断业务是否成功,剥离无效的数据

const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 配置请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 修改config,比如修改请求头
    // 获取token=====>就是获取user
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${store.user.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 将来
// axios
//   .get()
//   .then((res) => { // res就是后台的数据,之前的res.data })
//   .catch((e) => { // 200+10001这种情况,e就是res.data,如果是状态码的错误 401 403 404 e就是错误对象 })

instance.interceptors.response.use(
  (res) => {
    // status 是200是响应成功的, res.data.code 是10000业务成功
    // 如果不是10000呢,使用 vant 的轻提示,报错阻断程序
    if (res.data.code !== 10000) {
      Toast(res.data.message || '网络异常')
      return Promise.reject(res.data)
    }
    // 剥离无效数据
    return res.data
  },
  (err) => {
    // 请求报错,响应出错
    return Promise.reject(err)
  }
)
// 2.请求工具函数
