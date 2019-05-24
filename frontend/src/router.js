import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import App from './App.vue';
import { AuthRoutes } from '@/utils/constants.js';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: App,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      rewrite: AuthRoutes.LOGIN
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next('login');
    }
  }
  next();
});

export default router;
