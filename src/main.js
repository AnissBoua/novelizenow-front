import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Button from '@/components/Button.vue';

import App from './App.vue'
import router from './router'
import './assets/main.scss'
import './assets/style.css'

import CKEditor from '@ckeditor/ckeditor5-vue';

const app = createApp(App)

app.component('Button', Button)
app.use(createPinia())
app.use(router)
app.use(CKEditor)

app.mount('#app')
