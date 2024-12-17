import { useUserStore } from '@/store';
import { watch } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import AddCard from '@/views/AddCard.vue';
import CardDetail from '@/views/CardDetail.vue';
import Login from '@/views/LoginUser.vue';
import MyCollection from '@/views/MyCollection.vue';
import Profile from '@/views/ProfileUser.vue';
import Register from '@/views/RegisterUser.vue';
import ScanView from '@/views/ScanView.vue';
import SetDetail from '@/views/SetDetail.vue';
import SetsUser from '@/views/SetsUser.vue';
import WishlistUser from '@/views/WishlistUser.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MyCollection,
    meta: { requiresAuth: true },
  },
  {
    path: '/MyCollection',
    name: 'MyCollection',
    component: MyCollection,
    meta: { requiresAuth: true },
  },
  {
    path: '/loginUser',
    name: 'LoginUser',
    component: Login,
  },
  {
    path: '/registerUser',
    name: 'RegisterUser',
    component: Register,
  },
  {
    path: '/cardDetail/:id/:source',
    name: 'CardDetail',
    component: CardDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/addCard',
    name: 'AddCard',
    component: AddCard,
    meta: { requiresAuth: true },
  },
  {
    path: '/wishlist',
    name: 'WishlistUser',
    component: WishlistUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/sets',
    name: 'Sets',
    component: SetsUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/sets/:setId',
    name: 'SetDetail',
    component: SetDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/scan',
    name: 'ScanView',
    component: ScanView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If auth is not ready, wait until it is
  if (!userStore.isAuthReady) {
    const unwatch = watch(
      () => userStore.isAuthReady,
      (isAuthReady) => {
        if (isAuthReady) {
          unwatch(); // Stop watching
          const isAuthenticated = userStore.user !== null;

          if (requiresAuth && !isAuthenticated) {
            next({ name: 'LoginUser' });
          } else {
            next();
          }
        }
      }
    );
  } else {
    const isAuthenticated = userStore.user !== null;

    if (requiresAuth && !isAuthenticated) {
      next({ name: 'LoginUser' });
    } else {
      next();
    }
  }
});

export default router;
