import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Button from "@/components/Button.vue";

import App from './App.vue'
import router from './router'
import './assets/main.scss'
import './assets/style.css'


const app = createApp(App)

app.component('QuillEditor', QuillEditor)
app.component("Button", Button)
app.use(createPinia())
app.use(router)

app.mount('#app')
