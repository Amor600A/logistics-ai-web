import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../components/LoginView.vue';
import IndexView from '../components/IndexView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    name: 'Index',
    component: IndexView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
      // 未登录，重定向到登录页
      next('/login');
    } else {
      // 已登录，允许访问
      next();
    }
  } else {
    // 不需要登录的页面，直接允许访问
    next();
  }
});

export default router;
