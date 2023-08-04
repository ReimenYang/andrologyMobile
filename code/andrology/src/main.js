import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'
// import VueAxios from 'vue-axios'
// import Element from './plugins/element'
import ElementPlus from 'element-plus'
import * as el from 'element-plus'
import 'element-plus/dist/index.css'
import * as echarts from 'echarts'
import libs from '@/libs'
import xnwTemplateList from '@/components/template_list.vue'
import xnwTemplateForm from '@/components/template_form.vue'
import xnwFromComponent from '@/components/from_component.vue'
import uploadFile from '@/libs/components/element/upload/uploadFile.vue'
import uploadVideo from '@/libs/components/aliyun/uploadVideo/uploadVideo.vue'
import videoPlayer from '@/libs/components/aliyun/videoPlayer/videoPlayer.vue'
// import projectConfig from '@/projectConfig.js'
libs.el = el
libs["$alert"] = el.ElMessage
const app = createApp(App)
  .use(store)
  .use(router)
  // .use(VueAxios, axios)
  .component('xnwTemplateList', xnwTemplateList)
  .component('xnwTemplateForm', xnwTemplateForm)
  .component('xnwFromComponent', xnwFromComponent)
  .component('uploadFile', uploadFile)
  .component('uploadVideo', uploadVideo)
  .component('videoPlayer', videoPlayer)
  .use((app, options, name) => app.config.globalProperties[name] = options, libs, 'libs')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.configProject.globalData, 'globalData')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.request, 'request')
  .use((app, options, name) => app.config.globalProperties[name] = options, libs.api, 'api')
  // .use(Element)
  .use(ElementPlus)
  // .use((app, options, name) => app.config.globalProperties[name] = options, ElementPlus.ElMessage, 'ElMessage')
  .mount('#app')
app.echarts = echarts
libs.configProject.globalData.headers = { token: '' }

window.X = { ...libs }
