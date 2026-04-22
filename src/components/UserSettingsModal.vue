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
              </div>
            </div>
          </div>

          <div class="divider"></div>

          <div class="danger-zone-section">
            <h3 class="danger-title">Zona de Perigo</h3>
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
import { useRouter } from 'vue-router';
import { useProfile } from '../composables/useProfile';
import { supabase } from '../lib/supabase';

const router = useRouter();
const { profile, updateProfile } = useProfile();

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


.modal-body { padding: 24px; overflow-y: auto; max-height: 70vh; }

.settings-section { margin-bottom: 30px; }
.section-title { margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: var(--text-primary, #fff); }
.section-desc { margin: 0 0 20px 0; color: var(--text-secondary, #92929f); font-size: 13px; }

.profile-grid { display: flex; gap: 24px; align-items: center; }
.avatar-edit { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; }
.avatar-circle {
  width: 80px; height: 80px; border-radius: 12px; background: #2b2b40;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden; background-size: cover; background-position: center;
  border: 1px solid var(--border, #2b2b40); transition: all 0.2s;
}
.avatar-edit:hover .avatar-circle { border-color: var(--accent); }
.avatar-hover {
  position: absolute; inset: 0; background: rgba(0,0,0,0.4); 
  display: flex; align-items: center; justify-content: center;
  color: #fff; opacity: 0; transition: opacity 0.2s;
}
.avatar-edit:hover .avatar-hover { opacity: 1; }
.avatar-placeholder { font-size: 24px; font-weight: 700; color: var(--text-secondary, #a1a5b7); }
.edit-label { font-size: 11px; font-weight: 600; color: var(--accent); text-transform: uppercase; }

.profile-fields { flex: 1; display: flex; flex-direction: column; gap: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary, #a1a5b7); text-transform: uppercase; letter-spacing: 0.05em; }
.settings-input {
  background: var(--bg, #151521); border: 1px solid var(--border, #2b2b40);
  border-radius: 8px; padding: 10px 14px; font-size: 14px; color: var(--text-primary, #ffffff);
  transition: all 0.2s;
}
.settings-input:focus { outline: none; border-color: var(--accent); background: var(--surface, #1e1e2d); }

.divider { height: 1px; background: var(--border); margin: 0 0 30px 0; opacity: 0.5; }

.danger-zone-section .danger-title { margin: 0 0 4px 0; color: #f1416c; font-size: 16px; font-weight: 600; }
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
  color: var(--text-primary, #ffffff); font-size: 13px;
}
.confirm-input:focus { outline: none; border-color: #f1416c; }
.confirm-input::placeholder, .settings-input::placeholder { color: var(--text-secondary, #92929f); opacity: 0.7; }
.confirm-actions { display: flex; gap: 8px; }

.cancel-btn { padding: 10px 16px; border-radius: 6px; font-weight: 500; font-size: 13px; cursor: pointer; border: 1px solid var(--border, #2b2b40); background: transparent; color: var(--text-primary, #fff); }
.cancel-btn:hover { background: rgba(255,255,255,0.05); }

</style>
