import Vue from 'vue'
import App from './App'
import checkReady from '@/libs/uniInit'

App.mpType = 'app'
const app = new Vue({ ...App })
checkReady().then(() => app.$mount())
