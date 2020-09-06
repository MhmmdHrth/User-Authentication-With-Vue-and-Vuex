import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      component: () => import('../components/welcome'),
    },
    {
      path: '/signup',
      component: () => import('../components/signup'),
    },
    {
      path: '/signin',
      component: () => import('../components/signin'),
    },
    {
      path: '/dashboard',
      component: () => import('../components/dashboard'),
      beforeEnter(to, from, next) {
        if(store.state.idToken){
          next();
        }
        else{
          next("/signin");
        }
        
      },
    },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
