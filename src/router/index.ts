import { createRouter, createWebHashHistory } from 'vue-router';
import { supabase } from '../lib/supabase';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import PendingPayment from '../views/PendingPayment.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Dashboard from '../views/dashboard/Dashboard.vue';
import IdeaManager from '../views/dashboard/IdeaManager.vue';
import IdeaNetworkView from '../views/dashboard/IdeaNetworkView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/pending-payment', component: PendingPayment },

    // Área protegida do cliente
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: async (_to, _from, next) => {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          return next('/login');
        }

        const userId = session.user.id;

        // 1) Verifica se a conta está ativa
        const { data: clientData } = await supabase
          .from('clientes')
          .select('status')
          .eq('id', userId)
          .single();

        if (!clientData || clientData.status === 'inativo') {
          await supabase.auth.signOut();
          return next('/login');
        }

        // 2) Verifica se a assinatura ainda está dentro do prazo
        const { data: assinatura } = await supabase
          .from('assinaturas')
          .select('data_fim, status')
          .eq('cliente_id', userId)
          .order('data_fim', { ascending: false })
          .limit(1)
          .single();

        if (assinatura) {
          const vencida =
            assinatura.status === 'cancelado' ||
            (assinatura.data_fim && new Date(assinatura.data_fim) < new Date());

          if (vencida) {
            // Não faz logout — apenas bloqueia o acesso à área paga
            return next('/pending-payment');
          }
        }

        next();
      },
      children: [
        { path: '', component: Dashboard },
        { path: 'ideas', component: IdeaManager },
        { path: 'ideas/network/:rootId', component: IdeaNetworkView },
      ],
    },
  ],
});

export default router;
