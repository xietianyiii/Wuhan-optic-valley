import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/measuring',
    name: 'measuring',
    component: () => import(/* webpackChunkName: "measuring" */ '../views/Measuring.vue')
  },
  {
    path: '/video',
    name: 'video',
    component: () => import(/* webpackChunkName: "video" */ '../views/Video.vue')
  },
  {
    path: '/eventQuery',
    name: 'eventQuery',
    component: () => import(/* webpackChunkName: "eventQuery" */ '../views/EventQuery.vue')
  },
  {
    path: '/addEvent',
    name: 'addEvent',
    component: () => import(/* webpackChunkName: "addEvent" */ '../views/AddEvent.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
