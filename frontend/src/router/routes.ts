import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'Home',
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      { path: 'om', component: () => import('pages/AboutPage.vue') },
      { path: 'bestall', component: () => import('pages/OrderPage.vue') },
    ],
  },
  {
    //! Important: Make sure the StripeForm changes the
    //! url to this path if you change it here.
    path: '/bestall/klar',
    component: () => import('layouts/NoLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PaymentFinished.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
