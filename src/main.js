import './assets/css/base.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './helpers'

const initApp = async () => {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
}

initApp()
