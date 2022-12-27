import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  // 默认是/基准路径
  base: '/',
  plugins: [
    // 解析单文件组件的插件
    vue(),
    // 自动导入的插件,解析器可以是 vant element ant-vue
    // 默认自动加载 components 下的组件,通用级别组件
    Components({
      // 默认是true 开启自动生成组件的类型声明文件, vant的组件已经有类型声明文件,只要导入了就会使用类型声明。
      dts: false,
      // 在main.ts已经引入了所有的样式,不需要自动导入样式,只需要自动导入组件即可
      // 原因：Toast Confirm 这类组件的样式还是需要单独引入，样式全局引入了，关闭自动引入
      resolvers: [VantResolver({ importStyle: false })]
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
