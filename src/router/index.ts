import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import PendingPayment from '../views/PendingPayment.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/pending-payment', component: PendingPayment }
  ]
});

export default router;
