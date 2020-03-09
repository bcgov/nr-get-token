import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: { name: 'Home' }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
    },
    {
      path: '/secure',
      name: 'Secure',
      component: () => import(/* webpackChunkName: "secure" */ '@/views/Secure.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/myApps',
      name: 'MyApps',
      component: () => import(/* webpackChunkName: "my-apps" */ '@/views/MyApps.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/apps/:acronym',
      name: 'Application',
      component: () => import(/* webpackChunkName: "application" */ '@/views/Application.vue'),
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/404',
      alias: '*',
      name: 'NotFound',
      component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue')
    }
  ]
});

router.beforeEach((to, _from, next) => {
  NProgress.start();
  if (to.matched.some(route => route.meta.requiresAuth)
    && router.app.$keycloak
    && router.app.$keycloak.ready
    && !router.app.$keycloak.authenticated) {
    const loginUrl = router.app.$keycloak.createLoginUrl();
    window.location.replace(loginUrl);
  } else {
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
