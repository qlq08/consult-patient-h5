// 给components 下的全局组件, 设置类型
// 核心代码
// 1.导入组件实例
import CpNavBar from '@/components/CpNavBar.vue'

// const obj = {
//   name: 'jack',
//   age: 10
// }

// type Obj = typeof obj // 从一个JS对象中得到它对应的类型

// const obj2: Obj = {
//   name: 'tom',
//   age: 10
// }

// 2.声明 vue 类型模块
declare module 'vue' {
  // 3.给 vue 添加全局组件类型, interface 和之前的合并
  interface GlobalComponents {
    // 4.定义具体组件类型,typeof 获取到组件实例类型
    // typeof 作用是得到对应的TS类型
    // 指定组件类型, typeof 从组件对象得到类型,设置给全局组件: CpNavBar
    CpNavBar: typeof CpNavBar
  }
}
