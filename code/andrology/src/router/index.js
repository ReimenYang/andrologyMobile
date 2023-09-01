import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/wrap/index.vue'),
    meta: { title: '治疗预约系统' },
    children: [
      { path: '', redirect: '/user' },
      { path: '/index', component: () => import('@/views/index/index.vue') },
      { path: '/index/operationInfo', component: () => import('@/views/index/operationInfo.vue') },
      { path: '/testee', component: () => import('@/views/testee/index.vue') },
      { path: '/crf', component: () => import('@/views/crf/index.vue') },
      { path: '/ask', component: () => import('@/views/ask/index.vue') },
      { path: '/ask/report', component: () => import('@/views/ask/report.vue') },
      { path: '/data', component: () => import('@/views/data/index.vue') },
      { path: '/followUp', component: () => import('@/views/followUp/index.vue') },
      { path: '/message', component: () => import('@/views/message/index.vue') },
      { path: '/statistics', component: () => import('@/views/statistics/index.vue') },
    ]
  },
  {
    path: '/projectCenter',
    component: () => import('@/views/wrap/projectIndex.vue'),
    meta: { title: '项目中心' },
    children: [
      { path: '', redirect: '/projectCenter/info' },
      { path: '/projectCenter/info', component: () => import('@/views/projectCenter/info.vue') },
      { path: '/projectCenter/file', component: () => import('@/views/projectCenter/file.vue') },
      { path: '/projectCenter/testeeGroup', component: () => import('@/views/projectCenter/testeeGroup.vue') },
      { path: '/projectCenter/organization', component: () => import('@/views/projectCenter/organization.vue') },
      { path: '/projectCenter/authorize', component: () => import('@/views/projectCenter/authorize.vue') },
      { path: '/projectCenter/user', component: () => import('@/views/projectCenter/user.vue') },
    ]
  },
  {
    path: '/projectCenter/index',
    component: () => import('@/views/wrap/noMenu.vue'),
    meta: { title: '项目中心' },
    children: [
      { path: '', component: () => import('@/views/projectCenter/index.vue') }
    ]
  },
  {
    path: '/admin',
    meta: { title: '管理员登录' },
    children: [
      { path: '', redirect: '/admin/login' },
      { path: '/admin/login', component: () => import('@/views/admin/login.vue') }
    ]
  },
  {
    path: '/user',
    meta: { title: '用户登录' },
    children: [
      { path: '', redirect: '/user/login' },
      { path: '/user/login', component: () => import('@/views/user/login.vue') },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
