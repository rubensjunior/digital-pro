<template>
  <div class="onboarding-view">
    <div class="onboarding-container">
      
      <!-- Passo 0: Perfil do Usuário -->
      <div v-if="currentStep === 0" class="step-container" key="step0">
        <div class="onboarding-header">
          <div class="header-badge">Vamos nos conhecer</div>
          <h1 class="header-title">Olá! Como quer ser chamado?</h1>
          <p class="header-subtitle">
            Personalize sua experiência no Digital PRO. Estes dados aparecerão no seu perfil e nos seus relatórios.
          </p>
        </div>

        <div class="profile-setup">
          <div class="avatar-upload" @click="handleSelectAvatar">
            <div class="avatar-preview" :style="{ backgroundImage: profileForm.avatar_path ? `url(${profileForm.avatar_path})` : 'none' }">
              <svg v-if="!profileForm.avatar_path" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="40">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div class="avatar-overlay">
                <svg fill="currentColor" viewBox="0 0 20 20" width="16">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </div>
            <span class="avatar-label">Adicionar foto (opcional)</span>
          </div>

          <div class="form-group">
            <label>Seu Apelido *</label>
            <input 
              v-model="profileForm.nickname" 
              type="text" 
              placeholder="Ex: Rubens Júnior"
              class="form-input"
            >
          </div>

          <div class="form-group">
            <label>Sua Profissão ou Foco</label>
            <input 
              v-model="profileForm.profession" 
              type="text" 
              placeholder="Ex: Copywriter, Dev, Gestor..."
              class="form-input"
            >
          </div>
        </div>

        <div class="onboarding-footer">
          <button 
            class="btn-primary" 
            :disabled="!profileForm.nickname || loading"
            @click="handleProfileSubmit"
          >
            <span>Continuar</span>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Passo 1: Templates -->
      <div v-else class="step-container" key="step1">
        <div class="onboarding-header">
          <div class="header-badge">Ecosistema</div>
          <h1 class="header-title">Qual seu objetivo hoje?</h1>
          <p class="header-subtitle">
            Escolha um modelo para configurar automaticamente seus tipos de ideias, status e conexões iniciais.
          </p>
        </div>

        <div class="templates-grid">
          <div 
            v-for="t in templates" 
            :key="t.id" 
            class="template-card" 
            :class="{ active: selectedTemplate === t.id }"
            @click="selectedTemplate = t.id"
          >
            <div class="card-icon" :style="{ background: t.color + '20', color: t.color }">
              <span v-html="t.icon"></span>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ t.name }}</h3>
              <p class="card-description">{{ t.description }}</p>
              <div class="card-tags">
                <span v-for="tag in t.tags" :key="tag" class="card-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="card-check">
              <svg v-if="selectedTemplate === t.id" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div class="onboarding-notice">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Recomendamos escolher um template para entender melhor o funcionamento e o poder das hierarquias.</span>
        </div>

        <div class="onboarding-footer">
          <button 
            class="btn-secondary" 
            @click="handleStartFromScratch"
            :disabled="loading"
          >
            Começar do Zero
          </button>
          <button 
            class="btn-primary" 
            :disabled="!selectedTemplate || loading"
            @click="handleSetup"
          >
            <span v-if="!loading">Selecionar e Iniciar</span>
            <span v-else class="loader"></span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { supabase } from '../lib/supabase';
import { useWorkspaces } from '../composables/useWorkspaces';
import { useProfile } from '../composables/useProfile';
import { TEMPLATES } from '../lib/templates';

const router = useRouter();
const route = useRoute();
const { workspaces, fetchWorkspaces, createWorkspace } = useWorkspaces();
const { profile, loadProfile, updateProfile } = useProfile();
const currentStep = ref(0);
const selectedTemplate = ref('marketing');
const loading = ref(false);

// O estado do formulário agora é o próprio profile do composable
// mas para o onboarding, podemos usar uma cópia ou o próprio se quisermos reatividade imediata.
// Vamos usar o próprio para simplificar.
const profileForm = profile;

onMounted(async () => {
  const step = route.query.step;
  if (step) {
    currentStep.value = parseInt(step as string, 10);
  }

  await loadProfile();
});

async function handleSelectAvatar() {
  console.log('Botão de avatar clicado');
  try {
    const path = await window.electronAPI.user.selectAvatar();
    console.log('Caminho recebido do Electron:', path);
    if (path) {
      profileForm.value.avatar_path = path;
    }
  } catch (err) {
    console.error('Erro ao chamar selectAvatar:', err);
  }
}

async function handleProfileSubmit() {
  if (!profileForm.value.nickname) return;
  loading.value = true;
  try {
    // Atualizar Profile através do composable (cuida de SQLite e Supabase)
    await updateProfile({
      nickname: profileForm.value.nickname,
      profession: profileForm.value.profession,
      avatar_path: profileForm.value.avatar_path
    });

    // 3. Verifica a Necessidade de Setup do Template
    await fetchWorkspaces();
    if (workspaces.value.length === 0) {
      currentStep.value = 1;
    } else {
      router.replace('/dashboard/ideas');
    }
  } catch (e) {
    console.error('Erro ao salvar perfil:', e);
  } finally {
    loading.value = false;
  }
}

const templates = TEMPLATES;

async function handleSetup() {
  if (!selectedTemplate.value) return;
  loading.value = true;
  try {
    await window.electronAPI.workspaces.setupTemplate(selectedTemplate.value);
    await fetchWorkspaces();
    router.replace('/dashboard/ideas');
  } catch (e) {
    console.error('Erro ao configurar template:', e);
  } finally {
    loading.value = false;
  }
}

async function handleStartFromScratch() {
  loading.value = true;
  try {
    await createWorkspace('Workspace', '#3b82f6');
    await fetchWorkspaces();
    router.replace('/dashboard/ideas');
  } catch (e) {
    console.error('Erro ao criar workspace do zero:', e);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.onboarding-view {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.onboarding-container {
  width: 100%;
  max-width: 1100px;
  animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 20px 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.onboarding-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.header-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.header-subtitle {
  font-size: 15px;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

.profile-setup {
  max-width: 480px;
  margin: 0 auto 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-bottom: 8px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 2px dashed #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center;
  transition: all 0.3s;
  color: #94a3b8;
}

.avatar-upload:hover .avatar-preview {
  border-color: #3b82f6;
  background-color: #f0f7ff;
  color: #3b82f6;
}

.avatar-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #3b82f6;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.avatar-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.form-group label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-input {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 30px;
}

.template-card {
  background: #ffffff;
  border: 1.5px solid #f1f5f9;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: left;
}

.template-card:hover {
  border-color: #e2e8f0;
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -12px rgba(0,0,0,0.08);
}

.template-card.active {
  border-color: #3b82f6;
  background: #f0f7ff;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(59,130,246,0.15);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;
  font-size: 20px;
}

.card-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
  line-height: 1.2;
}

.card-description {
  font-size: 13.5px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 auto; /* Empurra tags para o fundo */
  padding-bottom: 16px;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.card-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.card-check {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 10px rgba(59,130,246,0.3);
}

.template-card.active .card-check {
  opacity: 1;
  transform: scale(1);
}

.card-check svg {
  width: 12px;
  height: 12px;
}

.onboarding-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #f8fafc;
  color: #64748b;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  font-size: 13px;
  border: 1px solid #f1f5f9;
}

.onboarding-notice svg {
  color: #3b82f6;
}

.onboarding-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn-secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}

.btn-primary {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 12px 36px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 20px -5px rgba(15,23,42,0.2);
}

.btn-primary:hover:not(:disabled) {
  background: #1e293b;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -8px rgba(15,23,42,0.3);
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.loader {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 1024px) {
  .onboarding-container { padding: 40px; }
  .templates-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .template-card { min-height: auto; }
}

@media (max-width: 640px) {
  .onboarding-container { padding: 30px 20px; border-radius: 0; }
  .header-title { font-size: 32px; }
  .templates-grid { grid-template-columns: 1fr; }
  .onboarding-footer { flex-direction: column-reverse; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; }
}
</style>
