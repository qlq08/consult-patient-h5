// 目录下的入口文件
// 1.单独维护pinia
// 2.创建好的pinia仓库统一从这里导出
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建pinia实例
const pinia = createPinia()

pinia.use(persist)
// 使用pinia插件，use(pinia的插件)
export default pinia

// 完整写法
/* import { useUserStore } from './user'
export { useUserStore }
 */
// 统一导出
export * from './user'
