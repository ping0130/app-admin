import { createApp } from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import * as ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import enLocale from 'element-plus/es/locale/lang/en'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/permission' // permission control
import registerGlobalComponents from '@/icons/index.js'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 创建 Vue 3 应用实例
const app = createApp(App)
// set ElementUI lang to EN
app.use(ElementPlus, { locale: enLocale })
// 全局注册 SvgIcon 组件
registerGlobalComponents(app)
// 注册Icons 全局组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(store) // Vuex Store
app.use(router) // Vue Router
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 挂载应用
app.mount('#app')
