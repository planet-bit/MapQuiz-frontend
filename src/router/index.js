import { createRouter, createWebHistory } from 'vue-router';
import MainView from '@/views/MainView.vue';
import RecordsView from '@/views/RecordsView.vue';

const routes = [
  { path: '/', component: MainView },
  { path: '/records', component: RecordsView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
