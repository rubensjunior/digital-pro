<template>
  <div class="fw-editor-page">

    <!-- TOAST -->
    <div v-if="toast.visible" :class="['bv-toast', `bv-toast-${toast.type}`]">{{ toast.message }}</div>

    <!-- LOADING -->
    <div v-if="loading" class="fw-loading">
      <div class="fw-spinner"></div>
      <span>Carregando ferramenta...</span>
    </div>

    <!-- CONTENT -->
    <template v-else-if="framework">

      <!-- TOOLBAR COMPACTA -->
      <div class="fw-page-toolbar">
        <div class="fw-page-toolbar-left">
          <button class="fw-back-btn" @click="router.push('/dashboard/frameworks')" title="Voltar para Ferramentas">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </button>
          <div class="fw-title-area">
            <span class="fw-type-chip">
              {{ framework.framework === 'swot' ? '📊 SWOT' : '🧩 BMC' }}
            </span>
            <input
              ref="titleInputRef"
              v-model="nomeFerramenta"
              class="fw-title-input"
              :placeholder="framework.framework === 'swot' ? 'Nome da análise SWOT...' : 'Nome do Canvas BMC...'"
              @input="markDirty"
              @blur="autoSaveNome"
              maxlength="80"
            />
            <span v-if="isDirty" class="fw-dirty-dot" title="Alterações não salvas">●</span>
          </div>
        </div>
        <div class="fw-page-toolbar-right">
          <span class="fw-save-hint">Ctrl+S</span>
          <button class="fw-btn-save" :disabled="saving" @click="handleSave">
            <svg v-if="!saving" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <div v-else class="fw-spinner-small"></div>
            {{ saving ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </div>

      <!-- SWOT EDITOR -->
      <div v-if="framework.framework === 'swot'" class="fw-swot-page">
        <div class="swot-grid">
          <div class="swot-quadrant forces">
            <div class="swot-quadrant-header">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <div>
                <div class="swot-label">S — Forças</div>
                <div class="swot-sublabel">Strengths · Vantagens internas</div>
              </div>
            </div>
            <textarea v-model="swotData.strengths" @input="markDirty" placeholder="Quais são suas principais vantagens internas? O que você faz melhor que a concorrência? Quais recursos exclusivos você possui?"></textarea>
          </div>

          <div class="swot-quadrant weaknesses">
            <div class="swot-quadrant-header">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              <div>
                <div class="swot-label">W — Fraquezas</div>
                <div class="swot-sublabel">Weaknesses · Pontos a melhorar</div>
              </div>
            </div>
            <textarea v-model="swotData.weaknesses" @input="markDirty" placeholder="Quais são as desvantagens internas? Onde há falta de recursos ou habilidades? O que os concorrentes fazem melhor?"></textarea>
          </div>

          <div class="swot-quadrant opportunities">
            <div class="swot-quadrant-header">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              <div>
                <div class="swot-label">O — Oportunidades</div>
                <div class="swot-sublabel">Opportunities · Fatores externos positivos</div>
              </div>
            </div>
            <textarea v-model="swotData.opportunities" @input="markDirty" placeholder="Quais tendências do mercado podem ser aproveitadas? Existem novos nichos ou mudanças regulatórias favoráveis?"></textarea>
          </div>

          <div class="swot-quadrant threats">
            <div class="swot-quadrant-header">
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <div>
                <div class="swot-label">T — Ameaças</div>
                <div class="swot-sublabel">Threats · Riscos externos</div>
              </div>
            </div>
            <textarea v-model="swotData.threats" @input="markDirty" placeholder="O que seus concorrentes estão fazendo? Quais mudanças econômicas ou tecnológicas podem impactar negativamente?"></textarea>
          </div>
        </div>
      </div>

      <!-- BMC EDITOR -->
      <div v-else-if="framework.framework === 'bmc'" class="fw-bmc-page">
        <div class="bmc-grid">
          <div class="bmc-top-row">
            <div class="bmc-block bmc-kp">
              <div class="bmc-block-header bmc-color-gray">
                <span class="bmc-icon">🤝</span>
                <div>
                  <div class="bmc-label">Parcerias Principais</div>
                  <div class="bmc-sublabel">Key Partners</div>
                </div>
              </div>
              <textarea v-model="bmcData.keyPartners" @input="markDirty" placeholder="Quem são seus principais parceiros e fornecedores?"></textarea>
            </div>

            <div class="bmc-block bmc-ka-kr">
              <div class="bmc-inner-block">
                <div class="bmc-block-header bmc-color-blue">
                  <span class="bmc-icon">⚙️</span>
                  <div>
                    <div class="bmc-label">Atividades Principais</div>
                    <div class="bmc-sublabel">Key Activities</div>
                  </div>
                </div>
                <textarea v-model="bmcData.keyActivities" @input="markDirty" placeholder="Quais atividades chave sua proposta de valor exige?"></textarea>
              </div>
              <div class="bmc-inner-block">
                <div class="bmc-block-header bmc-color-blue">
                  <span class="bmc-icon">💎</span>
                  <div>
                    <div class="bmc-label">Recursos Principais</div>
                    <div class="bmc-sublabel">Key Resources</div>
                  </div>
                </div>
                <textarea v-model="bmcData.keyResources" @input="markDirty" placeholder="Quais recursos chave sua proposta de valor exige?"></textarea>
              </div>
            </div>

            <div class="bmc-block bmc-vp">
              <div class="bmc-block-header bmc-color-purple">
                <span class="bmc-icon">💡</span>
                <div>
                  <div class="bmc-label">Proposta de Valor</div>
                  <div class="bmc-sublabel">Value Propositions</div>
                </div>
              </div>
              <textarea v-model="bmcData.valuePropositions" @input="markDirty" placeholder="Que valor você entrega ao cliente? Qual problema você ajuda a resolver?"></textarea>
            </div>

            <div class="bmc-block bmc-cr-ch">
              <div class="bmc-inner-block">
                <div class="bmc-block-header bmc-color-green">
                  <span class="bmc-icon">💬</span>
                  <div>
                    <div class="bmc-label">Relacionamento</div>
                    <div class="bmc-sublabel">Customer Relationships</div>
                  </div>
                </div>
                <textarea v-model="bmcData.customerRelationships" @input="markDirty" placeholder="Que tipo de relacionamento cada segmento de cliente espera?"></textarea>
              </div>
              <div class="bmc-inner-block">
                <div class="bmc-block-header bmc-color-green">
                  <span class="bmc-icon">📣</span>
                  <div>
                    <div class="bmc-label">Canais</div>
                    <div class="bmc-sublabel">Channels</div>
                  </div>
                </div>
                <textarea v-model="bmcData.channels" @input="markDirty" placeholder="Através de quais canais seus clientes querem ser alcançados?"></textarea>
              </div>
            </div>

            <div class="bmc-block bmc-cs">
              <div class="bmc-block-header bmc-color-orange">
                <span class="bmc-icon">👥</span>
                <div>
                  <div class="bmc-label">Segmentos de Clientes</div>
                  <div class="bmc-sublabel">Customer Segments</div>
                </div>
              </div>
              <textarea v-model="bmcData.customerSegments" @input="markDirty" placeholder="Para quem estamos criando valor? Quem são nossos clientes mais importantes?"></textarea>
            </div>
          </div>

          <div class="bmc-bottom-row">
            <div class="bmc-block bmc-cost">
              <div class="bmc-block-header bmc-color-red">
                <span class="bmc-icon">💸</span>
                <div>
                  <div class="bmc-label">Estrutura de Custos</div>
                  <div class="bmc-sublabel">Cost Structure</div>
                </div>
              </div>
              <textarea v-model="bmcData.costStructure" @input="markDirty" placeholder="Quais são os custos mais importantes inerentes ao seu modelo de negócio?"></textarea>
            </div>
            <div class="bmc-block bmc-revenue">
              <div class="bmc-block-header bmc-color-teal">
                <span class="bmc-icon">💰</span>
                <div>
                  <div class="bmc-label">Fontes de Receita</div>
                  <div class="bmc-sublabel">Revenue Streams</div>
                </div>
              </div>
              <textarea v-model="bmcData.revenueStreams" @input="markDirty" placeholder="Pelo que os clientes estão realmente dispostos a pagar?"></textarea>
            </div>
          </div>
        </div>
      </div>

    </template>

    <!-- NOT FOUND -->
    <div v-else-if="!loading" class="fw-not-found">
      <h3>Ferramenta não encontrada</h3>
      <button class="fw-back-btn" @click="router.push('/dashboard/frameworks')">← Voltar</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useWorkspaces } from '../../composables/useWorkspaces';
import type { Framework } from '../../types/ideia';

const router = useRouter();
const route = useRoute();
const { currentWorkspaceId } = useWorkspaces();

const framework = ref<Framework | null>(null);
const loading = ref(true);
const saving = ref(false);
const isDirty = ref(false);
const nomeFerramenta = ref('');
const titleInputRef = ref<HTMLInputElement | null>(null);

const toast = reactive({ visible: false, message: '', type: 'success' });
let toastTimer: ReturnType<typeof setTimeout> | null = null;

function showToast(msg: string, type: 'success' | 'error' = 'success') {
  toast.message = msg; toast.type = type; toast.visible = true;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.visible = false; }, 3000);
}

// ── SWOT Data
const swotData = reactive({ strengths: '', weaknesses: '', opportunities: '', threats: '' });

// ── BMC Data
const bmcData = reactive({
  keyPartners: '', keyActivities: '', keyResources: '',
  valuePropositions: '', customerRelationships: '', channels: '',
  customerSegments: '', costStructure: '', revenueStreams: ''
});

function markDirty() { isDirty.value = true; }

onMounted(async () => {
  const id = route.params.id as string;
  const type = route.params.type as string;
  if (!id || !currentWorkspaceId.value) { loading.value = false; return; }

  try {
    const all = await window.electronAPI.frameworks.getAll({ workspace_id: currentWorkspaceId.value });
    const found = all.find(f => f.id === id && f.framework === type);
    if (found) {
      framework.value = found;
      nomeFerramenta.value = found.nome || '';
      if (found.dados && found.dados !== '{}') {
        try {
          const parsed = JSON.parse(found.dados);
          if (type === 'swot') Object.assign(swotData, parsed);
          if (type === 'bmc') Object.assign(bmcData, parsed);
        } catch { /* ignore */ }
      }
    }
  } finally {
    loading.value = false;
  }

  // Ctrl+S para salvar
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

function handleKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    handleSave();
  }
}

async function handleSave() {
  if (!framework.value || !currentWorkspaceId.value) return;
  saving.value = true;
  try {
    const dados = framework.value.framework === 'swot'
      ? JSON.stringify(swotData)
      : JSON.stringify(bmcData);

    const saved = await window.electronAPI.frameworks.save({
      workspace_id: currentWorkspaceId.value,
      framework: framework.value.framework,
      nome: nomeFerramenta.value.trim() || undefined,
      dados
    });

    framework.value = saved;
    isDirty.value = false;
    showToast('Salvo com sucesso!');
  } catch {
    showToast('Erro ao salvar. Tente novamente.', 'error');
  } finally {
    saving.value = false;
  }
}

async function autoSaveNome() {
  if (!framework.value || !currentWorkspaceId.value) return;
  // Salva automaticamente o nome quando perde o foco, sem marcar dirty
  const dados = framework.value.framework === 'swot'
    ? JSON.stringify(swotData)
    : JSON.stringify(bmcData);
  await window.electronAPI.frameworks.save({
    workspace_id: currentWorkspaceId.value,
    framework: framework.value.framework,
    nome: nomeFerramenta.value.trim() || undefined,
    dados
  });
}
</script>

<style scoped>
.fw-editor-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 0;
  overflow: hidden;
}

/* ─── Toast ─── */
.bv-toast {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
  padding: 12px 24px; border-radius: 8px; color: white;
  font-weight: 600; font-size: 14px; z-index: 9999;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  animation: slideDownToast 0.3s ease-out forwards;
}
.bv-toast-success { background: #10b981; }
.bv-toast-error { background: #ef4444; }
@keyframes slideDownToast {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}

/* ─── Loading ─── */
.fw-loading {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; height: 200px; color: var(--text-secondary);
}
.fw-spinner {
  width: 24px; height: 24px; border: 2px solid var(--border);
  border-top-color: var(--accent); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.fw-spinner-small {
  width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4);
  border-top-color: white; border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Toolbar Compacta ─── */
.fw-page-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0 16px 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
  flex-shrink: 0;
  gap: 12px;
}
.fw-page-toolbar-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.fw-page-toolbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.fw-back-btn {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; flex-shrink: 0;
  background: transparent; border: 1px solid var(--border);
  border-radius: 8px; color: var(--text-secondary); cursor: pointer;
  transition: all 0.2s;
}
.fw-back-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(0,158,247,0.05); }
.fw-type-chip {
  flex-shrink: 0; font-size: 12px; font-weight: 700;
  background: var(--border); color: var(--text-secondary);
  padding: 3px 10px; border-radius: 99px;
}
.fw-title-area { display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; }
.fw-title-input {
  flex: 1; min-width: 0; border: none; background: transparent;
  font-size: 15px; font-weight: 600; color: var(--text-primary);
  outline: none; padding: 4px 6px; border-radius: 6px;
  transition: background 0.2s;
}
.fw-title-input:focus { background: var(--border); }
.fw-title-input::placeholder { color: var(--text-secondary); font-weight: 400; opacity: 0.6; }
.fw-dirty-dot { color: #f59e0b; font-size: 12px; flex-shrink: 0; }
.fw-save-hint { font-size: 11px; color: var(--text-secondary); }
.fw-btn-save {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; background: var(--accent); color: white;
  border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.fw-btn-save:hover { opacity: 0.9; }
.fw-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* ─── Not Found ─── */
.fw-not-found { text-align: center; padding: 80px 20px; }

/* ════════════════════════════════════ SWOT */
.fw-swot-page {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.swot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  flex: 1;
  height: 100%;
}
.swot-quadrant {
  border-radius: 12px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--surface);
  transition: box-shadow 0.2s;
}
.swot-quadrant:focus-within {
  box-shadow: 0 0 0 2px var(--accent);
  border-color: var(--accent);
}
.swot-quadrant-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid;
  flex-shrink: 0;
}
.swot-label { font-size: 13px; font-weight: 700; }
.swot-sublabel { font-size: 11px; opacity: 0.7; margin-top: 1px; }
.swot-quadrant textarea {
  flex: 1; resize: none; border: none; background: transparent;
  padding: 16px; font-family: inherit; font-size: 13.5px;
  color: var(--text-primary); outline: none; line-height: 1.7;
}
.swot-quadrant textarea::placeholder { color: var(--text-secondary); opacity: 0.6; }

.forces .swot-quadrant-header {
  background: rgba(16,185,129,0.08); color: #059669;
  border-bottom-color: rgba(16,185,129,0.2);
}
.weaknesses .swot-quadrant-header {
  background: rgba(245,158,11,0.08); color: #d97706;
  border-bottom-color: rgba(245,158,11,0.2);
}
.opportunities .swot-quadrant-header {
  background: rgba(59,130,246,0.08); color: #2563eb;
  border-bottom-color: rgba(59,130,246,0.2);
}
.threats .swot-quadrant-header {
  background: rgba(239,68,68,0.08); color: #dc2626;
  border-bottom-color: rgba(239,68,68,0.2);
}

/* ════════════════════════════════════ BMC */
.fw-bmc-page {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.bmc-grid {
  display: flex; flex-direction: column; gap: 12px;
  flex: 1; overflow: hidden;
}
.bmc-top-row {
  display: flex; flex: 2; gap: 10px; min-height: 0;
}
.bmc-bottom-row {
  display: flex; flex: 1; gap: 10px; min-height: 0;
}
.bmc-block {
  flex: 1; border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface); display: flex; flex-direction: column;
  overflow: hidden; transition: box-shadow 0.2s;
}
.bmc-block:focus-within { box-shadow: 0 0 0 2px var(--accent); border-color: var(--accent); }
.bmc-ka-kr, .bmc-cr-ch { display: flex; flex-direction: column; gap: 10px; background: transparent; border: none; border-radius: 0; padding: 0; }
.bmc-inner-block {
  flex: 1; border: 1px solid var(--border); border-radius: 10px;
  background: var(--surface); display: flex; flex-direction: column;
  overflow: hidden; transition: box-shadow 0.2s;
}
.bmc-inner-block:focus-within { box-shadow: 0 0 0 2px var(--accent); border-color: var(--accent); }
.bmc-block-header {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; border-bottom: 1px solid; flex-shrink: 0;
}
.bmc-icon { font-size: 18px; flex-shrink: 0; }
.bmc-label { font-size: 12px; font-weight: 700; }
.bmc-sublabel { font-size: 10px; opacity: 0.65; margin-top: 1px; }
.bmc-block textarea, .bmc-inner-block textarea {
  flex: 1; resize: none; border: none; background: transparent;
  padding: 12px 14px; font-family: inherit; font-size: 12.5px;
  color: var(--text-primary); outline: none; line-height: 1.6;
}
.bmc-block textarea::placeholder, .bmc-inner-block textarea::placeholder {
  color: var(--text-secondary); opacity: 0.6;
}

/* BMC Colors */
.bmc-color-gray  { background: rgba(100,116,139,0.07); color: #475569; border-bottom-color: rgba(100,116,139,0.15); }
.bmc-color-blue  { background: rgba(59,130,246,0.07); color: #2563eb; border-bottom-color: rgba(59,130,246,0.15); }
.bmc-color-purple { background: rgba(139,92,246,0.08); color: #7c3aed; border-bottom-color: rgba(139,92,246,0.15); }
.bmc-color-green { background: rgba(16,185,129,0.07); color: #059669; border-bottom-color: rgba(16,185,129,0.15); }
.bmc-color-orange { background: rgba(245,158,11,0.07); color: #d97706; border-bottom-color: rgba(245,158,11,0.15); }
.bmc-color-red   { background: rgba(239,68,68,0.07); color: #dc2626; border-bottom-color: rgba(239,68,68,0.15); }
.bmc-color-teal  { background: rgba(20,184,166,0.07); color: #0d9488; border-bottom-color: rgba(20,184,166,0.15); }
</style>
