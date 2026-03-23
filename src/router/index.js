import { createRouter, createWebHistory } from 'vue-router';
import ExtractView from '../components/ExtractView.vue';
import HelloWorld from '../components/HelloWorld.vue'

const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    props: { msg: 'Welcome to Your Vue.js App AAA' },
    component: HelloWorld
  },
  {
    path: '/extract',
    name: 'extract',
    component: ExtractView
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
