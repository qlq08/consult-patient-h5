// 扩展元信息类型
import 'vue-router'

// 扩展    元信息类型
declare module 'vue-router' {
  interface RouteMeta {
    // 标题
    title?: string
  }
}
