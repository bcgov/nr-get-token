import NProgress from 'nprogress';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

let isFirstTransition = true;

/**
 * Constructs and returns a Vue Router object
 * @param {string} [basePath='/'] the base server path
 * @returns {object} a Vue Router object
 */
export default function getRouter(basePath = '/') {
  const router = new VueRouter({
    base: basePath,
    mode: 'history',
    routes: [
      {
        path: '/',
        redirect: { name: 'About' }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        meta: {
          hasLogin: true
        }
      },
      {
        path: '/admin',
        name: 'Admin',
        component: () => import(/* webpackChunkName: "admin" */ '@/views/Admin.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true
        }
      },
      {
        path: '/myApps',
        name: 'MyApps',
        component: () => import(/* webpackChunkName: "my-apps" */ '@/views/MyApps.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true
        }
      },
      {
        path: '/apps/:acronym',
        name: 'Application',
        component: () => import(/* webpackChunkName: "application" */ '@/views/Application.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true
        },
        props: true
      },
      {
        path: '/requestAccount',
        name: 'RequestAccount',
        component: () => import(/* webpackChunkName: "request-account" */ '@/views/RequestAccount.vue'),
        meta: {
          hasLogin: true,
          requiresAuth: true
        },
      },
      {
        path: '/documentation',
        name: 'Documentation',
        component: () => import(/* webpackChunkName: "documentation" */ '@/views/Documentation.vue'),
        meta: {
          hasLogin: true
        }
      },
      {
        path: '/404',
        alias: '*',
        name: 'NotFound',
        component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue'),
        meta: {
          hasLogin: true
        }
      }
    ]
  });

  router.beforeEach((to, _from, next) => {
    NProgress.start();
    if (to.matched.some(route => route.meta.requiresAuth)
      && router.app.$keycloak
      && router.app.$keycloak.ready
      && !router.app.$keycloak.authenticated) {
      const redirect = location.origin + basePath + to.path;
      const loginUrl = router.app.$keycloak.createLoginUrl({
        idpHint: 'idir',
        redirectUri: redirect
      });
      window.location.replace(loginUrl);
    } else {
      document.title = to.meta.title ? to.meta.title : process.env.VUE_APP_TITLE;
      if (to.query.r && isFirstTransition) {
        router.replace({ path: to.query.r.replace(basePath, '') });
      }
      next();
    }
  });

  router.afterEach(() => {
    isFirstTransition = false;
    NProgress.done();
  });

  return router;
}
