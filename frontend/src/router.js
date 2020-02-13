import Vue from 'vue';
import VueRouter from 'vue-router';

const Home = () => import('@/components/Home.vue');
import { AuthRoutes } from '@/utils/constants';
import store from './store';

Vue.use(VueRouter);

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '*',
      name: 'notfound',
      redirect: '/'
    }
  ]
});

// TODO: Consider creating an explicit login landing page route
router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      // next('login');
      window.location.href = AuthRoutes.LOGIN;
    }
  }
  next();
});

export default router;
