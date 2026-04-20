<template>
  <div v-if="isOpen" class="modal-overlay" @mousedown.self="fecharModal">
    <div class="modal-content danger-zone-modal">
      <div class="modal-header">
        <h2 class="modal-title">Configurações da Conta</h2>
        <button class="close-btn" @click="fecharModal">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="danger-zone-section">
          <h3>Zona de Perigo</h3>
          <p class="danger-desc">As ações abaixo são irreversíveis. Tenha certeza do que está fazendo.</p>
          
          <!-- Clear Database -->
          <div class="danger-item">
            <div class="item-info">
              <h4>Limpar Banco de Dados Local</h4>
              <p>Apaga permanentemente todos os workspaces, nichos, ideias e conexões do seu computador. Isso devolverá o aplicativo ao seu estado original vazio.</p>
            </div>
            <div class="item-action">
              <button v-if="!confirmingClear" class="danger-btn orange" @click="confirmingClear = true">Limpar Banco</button>
              <div v-else class="confirm-block">
                <input type="text" v-model="clearText" placeholder='Digite "CONFIRMAR"' class="confirm-input" />
                <div class="confirm-actions">
                  <button class="cancel-btn" @click="cancelClear">Cancelar</button>
                  <button class="danger-btn orange" :disabled="clearText !== 'CONFIRMAR' || isClearing" @click="handleClearDatabase">
                    {{ isClearing ? 'Limpando...' : 'Confirmar Limpeza' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Delete Account -->
          <div class="danger-item">
            <div class="item-info">
              <h4>Excluir Minha Conta</h4>
              <p>Exclui permanentemente sua conta, dados remotos, assinatura e todos os dados armazenados localmente e na nuvem. Acesso ao sistema será perdido imediatamente.</p>
            </div>
            <div class="item-action">
              <button v-if="!confirmingDelete" class="danger-btn red" @click="confirmingDelete = true">Excluir Conta</button>
              <div v-else class="confirm-block">
                <input type="text" v-model="deleteText" placeholder='Digite "CONFIRMAR"' class="confirm-input" />
                <div class="confirm-actions">
                  <button class="cancel-btn" @click="cancelDelete">Cancelar</button>
                  <button class="danger-btn red" :disabled="deleteText !== 'CONFIRMAR' || isDeleting" @click="handleDeleteAccount">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

const isOpen = ref(false);

const confirmingClear = ref(false);
const clearText = ref('');
const isClearing = ref(false);

const confirmingDelete = ref(false);
const deleteText = ref('');
const isDeleting = ref(false);

function abrirModal() {
  isOpen.value = true;
  cancelClear();
  cancelDelete();
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
    // Refresh page / workspaces via reload
    window.location.reload();
  } catch (error) {
    console.error('Erro ao limpar banco:', error);
    alert('Ocorreu um erro ao limpar o banco. Veja o console.');
  } finally {
    isClearing.value = false;
  }
}

async function handleDeleteAccount() {
  if (deleteText.value !== 'CONFIRMAR') return;
  isDeleting.value = true;
  
  try {
    // 1. Call Supabase RPC to delete user from cloud
    const { error: rpcError } = await supabase.rpc('delete_my_account');
    if (rpcError) {
      console.error('Supabase Delete Error:', rpcError);
      alert('Certifique-se que o script SQL foi executado no Supabase.\nErro: ' + rpcError.message);
      isDeleting.value = false;
      return;
    }
    
    // 2. Clear local DB since user doesn't exist anymore
    await window.electronAPI.user.clearDatabase();
    
    // 3. Sign out and redirect
    await supabase.auth.signOut();
    router.push('/login');
    
  } catch (error) {
    console.error('Erro geral ao excluir conta:', error);
    alert('Erro inexperado ao excluir conta.');
  } finally {
    isDeleting.value = false;
  }
}

defineExpose({ abrirModal, fecharModal });
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 10000; /* Alto z-index para sobrepor tudo */
}
.modal-content {
  background: var(--surface, #1e1e2d); border: 1px solid var(--border, #2b2b40);
  border-radius: 12px; width: 600px; max-width: 90vw; display: flex; flex-direction: column;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}
.modal-header {
  padding: 20px 24px; border-bottom: 1px solid var(--border, #2b2b40);
  display: flex; justify-content: space-between; align-items: center;
}
.modal-title { margin: 0; font-size: 18px; font-weight: 600; color: var(--text-primary, #ffffff); }
.close-btn { background: transparent; border: none; color: var(--text-secondary, #92929f); cursor: pointer; }
.close-btn svg { width: 20px; height: 20px; }
.close-btn:hover { color: #f1416c; }

.modal-body { padding: 24px; }

.danger-zone-section h3 { margin: 0 0 4px 0; color: #f1416c; font-size: 16px; font-weight: 600; }
.danger-desc { margin: 0 0 20px 0; color: var(--text-secondary, #92929f); font-size: 13px; }

.danger-item {
  background: rgba(241, 65, 108, 0.05); border: 1px solid rgba(241, 65, 108, 0.2);
  border-radius: 8px; padding: 16px; margin-bottom: 16px;
  display: flex; flex-direction: column; gap: 12px;
}
.item-info h4 { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: var(--text-primary, #fff); }
.item-info p { margin: 0; font-size: 12.5px; color: var(--text-secondary, #92929f); line-height: 1.5; }

.item-action { display: flex; align-items: flex-end; justify-content: flex-end; }

.danger-btn { padding: 10px 16px; border-radius: 6px; font-weight: 600; font-size: 13px; cursor: pointer; border: none; color: #fff; transition: opacity 0.2s; }
.danger-btn:hover { opacity: 0.9; }
.danger-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.danger-btn.red { background: #f1416c; }
.danger-btn.orange { background: #ff9800; }

.confirm-block { display: flex; flex-direction: column; gap: 8px; width: 100%; align-items: flex-end; }
.confirm-input {
  width: 100%; max-width: 250px; padding: 8px 12px; border-radius: 6px;
  border: 1px solid var(--border, #2b2b40); background: var(--bg, #151521);
  color: var(--text-primary, #fff); font-size: 13px;
}
.confirm-input:focus { outline: none; border-color: #f1416c; }
.confirm-actions { display: flex; gap: 8px; }

.cancel-btn { padding: 10px 16px; border-radius: 6px; font-weight: 500; font-size: 13px; cursor: pointer; border: 1px solid var(--border, #2b2b40); background: transparent; color: var(--text-primary, #fff); }
.cancel-btn:hover { background: rgba(255,255,255,0.05); }

</style>
