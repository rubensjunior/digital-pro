import { createRouter, createWebHashHistory } from 'vue-router';
import { supabase } from '../lib/supabase';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import PendingPayment from '../views/PendingPayment.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import Dashboard from '../views/dashboard/Dashboard.vue';
import IdeaManager from '../views/dashboard/IdeaManager.vue';
import IdeaNetworkView from '../views/dashboard/IdeaNetworkView.vue';
import GeneralNetworkView from '../views/dashboard/GeneralNetworkView.vue';
import GeneralFlowchartView from '../views/dashboard/GeneralFlowchartView.vue';
import IdeaFlowchartView from '../views/dashboard/IdeaFlowchartView.vue';
import IdeaKanbanView from '../views/dashboard/IdeaKanbanView.vue';
import Onboarding from '../views/Onboarding.vue';

const requireActivePlan = async () => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return '/login';
    }

    // Se estiver offline, permitimos o acesso baseado na sessão local
    // (Pois os dados do Brain Vault são locais no SQLite)
    if (!navigator.onLine) {
      console.log('App em modo offline. Ignorando verificação remota de assinatura.');
      return true;
    }

    const userId = session.user.id;

    // 1) Verifica se a conta está ativa
    const { data: clientData, error: clientError } = await supabase
      .from('clientes')
      .select('status')
      .eq('id', userId)
      .single();

    if (clientError) {
      console.error('Erro ao verificar status do cliente (offline?):', clientError);
      // Em caso de erro de rede (não falta de auth), permitimos passar
      return true;
    }

    if (!clientData || clientData.status !== 'ativo') {
      await supabase.auth.signOut();
      return '/pending-payment';
    }

    // 2) Verifica se a assinatura ainda está dentro do prazo
    const { data: assinatura, error: searchError } = await supabase
      .from('assinaturas')
      .select('proxima_cobranca, status')
      .eq('cliente_id', userId)
      .order('proxima_cobranca', { ascending: false })
      .limit(1)
      .single();

    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Erro ao verificar assinatura:', searchError);
      return true;
    }

    if (assinatura) {
      const vencida =
        assinatura.status === 'cancelado' ||
        (assinatura.proxima_cobranca && new Date(assinatura.proxima_cobranca) < new Date());

      if (vencida) {
        return '/pending-payment';
      }
    }
    
    return true;
  } catch (error) {
    console.error('Falha crítica na verificação de acesso:', error);
    // Em caso de erro catastrófico (ex: rede), tentamos deixar o usuário entrar se ele tiver sessão
    return true;
  }
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    { path: '/pending-payment', component: PendingPayment },
    { 
      path: '/onboarding', 
      component: Onboarding,
      beforeEnter: requireActivePlan
    },

    // Área protegida do cliente
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: requireActivePlan,
      children: [
        { path: '', component: Dashboard },
        { path: 'ideas', component: IdeaManager },
        { path: 'ideas/network/:rootId', component: IdeaNetworkView },
        { path: 'ideas/general-network', component: GeneralNetworkView },
        { path: 'ideas/flowchart/:rootId', component: IdeaFlowchartView },
        { path: 'ideas/general-flowchart', component: GeneralFlowchartView },
        { path: 'ideas/kanban/:id', component: IdeaKanbanView },
      ],
    },
  ],
});

export default router;
