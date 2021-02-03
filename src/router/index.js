import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '琴音部（台湾の軽音部）'
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      title: '琴音部 | 關於我們'
    }
  },
  {
    path: '/concert',
    name: 'Concert',
    // route level code-splitting
    // this generates a separate chunk (concert.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "concert" */ '../views/Concert.vue'),
    meta: {
      title: '琴音部 | 表演資訊'
    }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    // route level code-splitting
    // this generates a separate chunk (tickets.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tickets" */ '../views/Tickets.vue'),
    meta: {
      title: '琴音部 | 訂票'
    }
  },
  {
    path: '/messagebord',
    name: 'MessageBord',
    // route level code-splitting
    // this generates a separate chunk (connection.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "connection" */ '../views/Messagebord.vue'),
    meta: {
      title: '琴音部 | 留言板'
    }
  },
  {
    path: '/userCenter',
    name: 'UserCenter',
    // route level code-splitting
    // this generates a separate chunk (userCenter.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "userCenter" */ '../views/UserCenter.vue'),
    meta: {
      title: '琴音部 | 會員中心'
    }
  },
  {
    path: '/backstage',
    name: 'BackStage',
    component: () => import(/* webpackChunkName: "backstage" */ '../views/BackStage.vue'),
    meta: {
      title: '琴音部 | 後台'
    }
  }
]

const router = new VueRouter({
  routes
})

router.afterEach((to, from) => {
  let title = to.meta.title

  document.title = title
})

export default router
