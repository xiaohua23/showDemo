import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/index.vue'
import Draw from '../views/Draw/index.vue'
import Album from '../views/Album/index.vue'
import Audition from '../views/Audition/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/draw',
    name: 'Draw',
    component: Draw,
  },
  {
    path: '/album',
    name: 'Album',
    component: Album,
  },
  {
    path: '/audition',
    name: 'Audition',
    component: Audition,
  },
]

const router = new VueRouter({
  routes,
})

export default router
