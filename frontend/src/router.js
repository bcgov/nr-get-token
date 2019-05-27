// TODO: Refer to Vue CLI scaffolding for lazy-load support
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import App from './App.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'app',
      component: App
    },
    {
      path: '*',
      name: 'notfound',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.isAuthenticated) {
      next('login');
    }
  }
  next();
});

export default router;
