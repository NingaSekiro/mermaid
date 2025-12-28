import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css';
// 引入初始化样式文件
import '@/styles/common.scss'
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css'; // 引入样式

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd)
app.component('Splitpanes', Splitpanes)
app.component('Pane', Pane)
app.mount('#app')