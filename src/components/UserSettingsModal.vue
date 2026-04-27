<template>
  <Teleport to="body">
    <Transition name="dp-modal-fade">
      <div v-if="isOpen" class="dp-modal-overlay" @mousedown.self="fecharModal">
        <div class="dp-modal-container user-settings-width">
          <div class="dp-modal-header">
            <div class="idea-header-left">
              <div class="idea-icon-box">⚙️</div>
              <div>
                <h2 class="dp-modal-title">Configurações da Conta</h2>
                <p class="idea-header-sub">Gerencie seu perfil e dados do sistema</p>
              </div>
            </div>
            <button class="dp-close-btn" @click="fecharModal" title="Fechar">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="dp-modal-body">
            <!-- Seção de Perfil -->
            <div class="settings-section profile-edit-section">
              <h3 class="section-title">Meu Perfil</h3>
              <p class="section-desc">Como você aparece no sistema e nos relatórios.</p>

              <div class="profile-grid">
                <div class="avatar-edit" @click="handleSelectAvatar">
                  <div class="avatar-circle" :style="profile.avatar_path ? { backgroundImage: `url(${profile.avatar_path})` } : {}">
                    <div class="avatar-hover">
                      <svg fill="currentColor" viewBox="0 0 20 20" width="16"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                    </div>
                    <span v-if="!profile.avatar_path" class="avatar-placeholder">
                      {{ profile.nickname ? profile.nickname.charAt(0).toUpperCase() : '?' }}
                    </span>
                  </div>
                  <span class="edit-label">Alterar foto</span>
                </div>

                <div class="profile-fields">
                  <div class="field-group">
                    <label>Apelido *</label>
                    <input v-model="profile.nickname" type="text" placeholder="Ex: Rubens Júnior" class="settings-input" @blur="handleSaveProfile" />
                  </div>
                  <div class="field-group">
                    <label>Profissão / Foco</label>
                    <input v-model="profile.profession" type="text" placeholder="Ex: Gestor de Tráfego" class="settings-input" @blur="handleSaveProfile" />
                  </div>
                  <div class="field-group">
                    <label>E-mail (Login)</label>
                    <input :value="userEmail" type="text" readonly class="settings-input read-only-input" />
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-divider"></div>

            <!-- Seção de Assinatura -->
            <div class="settings-section subscription-section">
              <h3 class="section-title">Assinatura e Faturamento</h3>
              <p class="section-desc">Gerencie os detalhes do seu plano atual.</p>

              <div class="subscription-card">
                <div class="sub-details">
                  <div class="sub-plan-name">{{ subPlanName || 'Plano PRO' }}</div>
                  <div class="sub-status">
                    Status: 
                    <span v-if="subStatus === 'ativo'" class="text-green-500 font-bold">Ativa</span>
                    <span v-else-if="subStatus === 'cancelado'" class="text-orange-500 font-bold">Cancelada</span>
                    <span v-else-if="subStatus === 'FREE_TRIAL' || subStatus === 'gratuito'" class="text-blue-500 font-bold">Plano Gratuito</span>
                    <span v-else-if="!subStatus" class="text-slate-400 italic">Nenhuma assinatura vinculada</span>
                    <span v-else class="text-slate-500 font-bold">{{ subStatus }}</span>
                  </div>
                  <div class="sub-date" v-if="subNextDate && subStatus !== 'FREE_TRIAL'">
                    {{ subStatus === 'cancelado' ? 'Acesso válido até:' : 'Próxima cobrança:' }} <span class="font-semibold">{{ subNextDate }}</span>
                  </div>
                </div>
                <div class="sub-actions flex justify-end mt-2" v-if="subStatus === 'ativo'">
                  <button v-if="!confirmingCancelSub" class="dp-btn dp-btn-ghost sub-cancel-btn" @click="confirmingCancelSub = true">
                    Cancelar Assinatura
                  </button>
                  <div v-else class="confirm-cancel-box">
                    <p class="text-xs text-orange-500 font-medium mb-2 text-right">Tem certeza? O acesso ficará disponível apenas até {{ subNextDate }}.</p>
                    <div class="confirm-actions justify-end">
                      <button class="dp-btn dp-btn-ghost sm" @click="cancelCancelSub">Voltar</button>
                      <button class="dp-btn sm bg-orange-500 text-white border-none cursor-pointer" :disabled="isCancelingSub" @click="handleCancelSubscription">
                        {{ isCancelingSub ? 'Cancelando...' : 'Confirmar Cancelamento' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-divider"></div>

            <div class="danger-zone-section">
              <h3 class="danger-title">Zona de Perigo</h3>
              <p class="danger-desc">As ações abaixo são irreversíveis. Tenha certeza do que está fazendo.</p>
            
              <!-- Clear Database -->
              <div class="danger-card">
                <div class="item-info">
                  <h4>Limpar Banco de Dados Local</h4>
                  <p>Apaga permanentemente todos os workspaces, nichos, ideias e conexões do seu computador.</p>
                </div>
                <div class="item-action">
                  <button v-if="!confirmingClear" class="dp-btn dp-btn-ghost danger-text" @click="confirmingClear = true">Limpar Banco</button>
                  <div v-else class="confirm-block">
                    <input type="text" v-model="clearText" placeholder='Digite "CONFIRMAR"' class="confirm-input" />
                    <div class="confirm-actions">
                      <button class="dp-btn dp-btn-ghost sm" @click="cancelClear">Cancelar</button>
                      <button class="dp-btn dp-btn-danger sm" :disabled="clearText !== 'CONFIRMAR' || isClearing" @click="handleClearDatabase">
                        {{ isClearing ? 'Limpando...' : 'Confirmar Limpeza' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Delete Account -->
              <div class="danger-card red-border">
                <div class="item-info">
                  <h4>Excluir Minha Conta</h4>
                  <p>Exclui permanentemente sua conta, dados remotos, assinatura e todos os dados armazenados.</p>
                </div>
                <div class="item-action">
                  <button v-if="!confirmingDelete" class="dp-btn dp-btn-danger" @click="confirmingDelete = true">Excluir Conta</button>
                  <div v-else class="confirm-block">
                    <input type="text" v-model="deleteText" placeholder='Digite "CONFIRMAR"' class="confirm-input" />
                    <div class="confirm-actions">
                      <button class="dp-btn dp-btn-ghost sm" @click="cancelDelete">Cancelar</button>
                      <button class="dp-btn dp-btn-danger sm" :disabled="deleteText !== 'CONFIRMAR' || isDeleting" @click="handleDeleteAccount">
                        {{ isDeleting ? 'Excluindo...' : 'Confirmar Exclusão' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useProfile } from '../composables/useProfile';
import { supabase } from '../lib/supabase';
import { useConfirm } from '../composables/useConfirm';

const router = useRouter();
const { profile, updateProfile } = useProfile();
const { alert: bvAlert } = useConfirm();

const isOpen = ref(false);

const confirmingClear = ref(false);
const clearText = ref('');
const isClearing = ref(false);

const confirmingDelete = ref(false);
const deleteText = ref('');
const isDeleting = ref(false);

const userEmail = ref('');
const subStatus = ref('');
const subNextDate = ref('');
const subPlanName = ref('');

const isCancelingSub = ref(false);
const confirmingCancelSub = ref(false);

function cancelCancelSub() {
  confirmingCancelSub.value = false;
}

async function abrirModal() {
  isOpen.value = true;
  cancelClear();
  cancelDelete();
  cancelCancelSub();
  
  // Resetar estados antes da busca
  userEmail.value = '';
  subStatus.value = '';
  subNextDate.value = '';
  subPlanName.value = '';
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      userEmail.value = session.user.email;
      
      console.log('[UserSettings] Buscando assinatura para:', session.user.id);
      const { data: assinatura, error: subError } = await supabase
        .from('assinaturas')
        .select('status, proxima_cobranca, nome_plano')
        .eq('cliente_id', session.user.id)
        .order('criado_em', { ascending: false })
        .limit(1)
        .maybeSingle(); // maybeSingle evita erro de 0 rows
        
      if (subError) {
        console.error('[UserSettings] Erro na query de assinatura:', subError);
      }

      console.log('[UserSettings] Resultado assinatura:', assinatura);

      if (assinatura) {
        subStatus.value = assinatura.status || '';
        subPlanName.value = assinatura.nome_plano || 'Plano PRO';
        
        if (assinatura.proxima_cobranca) {
          const parts = assinatura.proxima_cobranca.split('-');
          if (parts.length === 3) {
            subNextDate.value = `${parts[2]}/${parts[1]}/${parts[0]}`;
          } else {
            subNextDate.value = assinatura.proxima_cobranca;
          }
        }
      } else {
        console.warn('[UserSettings] Nenhuma assinatura encontrada para este cliente.');
      }
    }
  } catch(e) {
    console.error('Erro ao buscar dados do usuário/assinatura:', e);
  }
}

async function handleCancelSubscription() {
  isCancelingSub.value = true;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Sessão expirada. Faça login novamente.');

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/cancel-subscription`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao processar cancelamento da assinatura.');
    }
    
    // Sucesso, atualiza a modal local
    subStatus.value = 'cancelado';
    bvAlert({ title: 'Assinatura Cancelada', message: 'Sua assinatura foi cancelada. Você ainda terá acesso ao sistema até o fim do ciclo vigente.', type: 'success' });
    cancelCancelSub();
    
  } catch (error: any) {
    console.error('Erro geral ao cancelar assinatura:', error);
    bvAlert({ title: 'Erro', message: error.message || 'Erro inesperado.', type: 'danger' });
  } finally {
    isCancelingSub.value = false;
  }
}

async function handleSelectAvatar() {
  try {
    const path = await window.electronAPI.user.selectAvatar();
    if (path) {
      await updateProfile({ avatar_path: path });
    }
  } catch (err) {
    console.error('Erro ao selecionar avatar:', err);
  }
}

async function handleSaveProfile() {
  if (!profile.value.nickname.trim()) return;
  await updateProfile({
    nickname: profile.value.nickname,
    profession: profile.value.profession
  });
}

function fecharModal() {
  isOpen.value = false;
}

function cancelClear() {
  confirmingClear.value = false;
  clearText.value = '';
}

function cancelDelete() {
  confirmingDelete.value = false;
  deleteText.value = '';
}

async function handleClearDatabase() {
  if (clearText.value !== 'CONFIRMAR') return;
  isClearing.value = true;
  
  try {
    await window.electronAPI.user.clearDatabase();
    window.location.reload();
  } catch (error) {
    console.error('Erro ao limpar banco:', error);
    bvAlert({ title: 'Erro', message: 'Ocorreu um erro ao limpar o banco.', type: 'danger' });
  } finally {
    isClearing.value = false;
  }
}

async function handleDeleteAccount() {
  if (deleteText.value !== 'CONFIRMAR') return;
  isDeleting.value = true;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Sessão expirada. Faça login novamente.');

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/delete-account`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao processar exclusão remota.');
    }
    
    // Sucesso na exclusão remota, agora limpa os dados locais
    await window.electronAPI.user.clearDatabase();
    await supabase.auth.signOut();
    router.push('/login');
    
  } catch (error: any) {
    console.error('Erro geral ao excluir conta:', error);
    bvAlert({ title: 'Erro', message: error.message || 'Erro inesperado ao excluir conta.', type: 'danger' });
  } finally {
    isDeleting.value = false;
  }
}

defineExpose({ abrirModal, fecharModal });
</script>

<style scoped>
.user-settings-width {
  width: 600px;
  max-width: 90vw;
}

.idea-header-left { display: flex; align-items: center; gap: 16px; }
.idea-icon-box {
  width: 44px; height: 44px; border-radius: 12px; background: rgba(59,130,246,0.1);
  display: flex; align-items: center; justify-content: center; font-size: 24px;
}
.idea-header-sub { font-size: 13px; color: var(--dp-modal-text-secondary); margin: 0; }



.settings-section { margin-bottom: 24px; }
.section-title { margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: var(--dp-modal-text-primary); }
.section-desc { margin: 0 0 20px 0; color: var(--dp-modal-text-secondary); font-size: 13px; }

.profile-grid { display: flex; gap: 24px; align-items: center; }
.avatar-edit { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
.avatar-circle {
  width: 80px; height: 80px; border-radius: 16px; background: var(--dp-modal-border);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; background-size: cover; background-position: center;
  border: 2px solid transparent; transition: all 0.2s;
}
.avatar-edit:hover .avatar-circle { border-color: #3b82f6; }
.avatar-hover {
  position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
  display: flex; align-items: center; justify-content: center;
  color: #fff; opacity: 0; transition: opacity 0.2s;
}
.avatar-edit:hover .avatar-hover { opacity: 1; }
.avatar-placeholder { font-size: 24px; font-weight: 700; color: var(--dp-modal-text-secondary); }
.edit-label { font-size: 11px; font-weight: 700; color: #3b82f6; text-transform: uppercase; }

.profile-fields { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font-size: 11px; font-weight: 700; color: var(--dp-modal-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
.settings-input {
  background: var(--dp-modal-bg); border: 1px solid var(--dp-modal-border);
  border-radius: 12px; padding: 12px 16px; font-size: 14px; color: var(--dp-modal-text-primary);
  transition: all 0.2s;
}
.settings-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
.settings-input.read-only-input {
  background: rgba(0, 0, 0, 0.05); /* Um pouco mais escuro para indicar readonly no light/dark mode dependendo do tema */
  opacity: 0.7;
  cursor: not-allowed;
}

/* Assinatura Card */
.subscription-card {
  background: rgba(59, 130, 246, 0.03);
  border: 1px solid var(--dp-modal-border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sub-plan-name { font-size: 15px; font-weight: 700; color: var(--dp-modal-text-primary); }
.sub-status, .sub-date { font-size: 13px; color: var(--dp-modal-text-secondary); margin-top: 4px; }
.sub-cancel-btn { color: #f97316 !important; border-color: rgba(249, 115, 22, 0.3) !important; }
.sub-cancel-btn:hover { background: rgba(249, 115, 22, 0.1) !important; border-color: #f97316 !important; }
.confirm-cancel-box { display: flex; flex-direction: column; align-items: flex-end; width: 100%; }
.bg-orange-500 { background-color: #f97316; }
.bg-orange-500:hover { filter: brightness(1.1); }

.modal-divider { height: 1px; background: var(--dp-modal-border); margin: 8px 0 24px 0; opacity: 0.6; }

.danger-zone-section .danger-title { margin: 0 0 4px 0; color: #f1416c; font-size: 16px; font-weight: 700; }
.danger-desc { margin: 0 0 20px 0; color: var(--dp-modal-text-secondary); font-size: 13px; }

.danger-card {
  background: rgba(241, 65, 108, 0.03); border: 1px solid var(--dp-modal-border);
  border-radius: 16px; padding: 16px; margin-bottom: 16px;
  display: flex; flex-direction: column; gap: 12px;
}
.danger-card.red-border { border-color: rgba(241, 65, 108, 0.2); }

.item-info h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 700; color: var(--dp-modal-text-primary); }
.item-info p { margin: 0; font-size: 12.5px; color: var(--dp-modal-text-secondary); line-height: 1.5; }

.item-action { display: flex; align-items: flex-end; justify-content: flex-end; }
.danger-text { color: #f1416c !important; }

.confirm-block { display: flex; flex-direction: column; gap: 12px; width: 100%; align-items: flex-end; }
.confirm-input {
  width: 100%; max-width: 280px; padding: 10px 14px; border-radius: 10px;
  border: 1px solid var(--dp-modal-border); background: var(--dp-modal-bg);
  color: var(--dp-modal-text-primary); font-size: 13px;
}
.confirm-input:focus { outline: none; border-color: #f1416c; }
.confirm-actions { display: flex; gap: 8px; }

.dp-btn.sm { padding: 8px 14px; font-size: 12px; border-radius: 10px; }

/* Animações de Transição customizadas */
.dp-modal-fade-enter-active,
.dp-modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.dp-modal-fade-enter-from,
.dp-modal-fade-leave-to {
  opacity: 0;
}
</style>
