import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import './styles/main.scss'

// 导入vant的全局样式  后面的main可以覆盖它
import 'vant/lib/index.css'
import './styles/main.scss'
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')
