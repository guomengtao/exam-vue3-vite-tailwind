import './http'; // 只需引入一次，就覆盖了全局 fetch
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'  // Import Tailwind CSS styles
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

 
 