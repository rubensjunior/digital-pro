<template>
  <div class="bmc-canvas-container">
    <div class="bmc-header">
      <h2>Business Model Canvas</h2>
      <button class="dp-btn dp-btn-primary" @click="save">Salvar Alterações</button>
    </div>

    <div class="bmc-grid">
      <!-- Row 1: Key Partnerships, Key Activities/Resources, Value Proposition, Customer Relationships/Channels, Customer Segments -->
      <div class="bmc-top-row">
        <div class="bmc-col bmc-kp">
          <div class="bmc-block">
            <h4>Parcerias Principais</h4>
            <textarea v-model="localData.keyPartners" placeholder="Quem são seus principais parceiros e fornecedores?"></textarea>
          </div>
        </div>
        <div class="bmc-col bmc-split">
          <div class="bmc-block">
            <h4>Atividades Principais</h4>
            <textarea v-model="localData.keyActivities" placeholder="Quais atividades chave sua proposta de valor exige?"></textarea>
          </div>
          <div class="bmc-block mt">
            <h4>Recursos Principais</h4>
            <textarea v-model="localData.keyResources" placeholder="Quais recursos chave sua proposta de valor exige?"></textarea>
          </div>
        </div>
        <div class="bmc-col bmc-vp">
          <div class="bmc-block">
            <h4>Proposta de Valor</h4>
            <textarea v-model="localData.valuePropositions" placeholder="Que valor você entrega ao cliente? Qual problema você ajuda a resolver?"></textarea>
          </div>
        </div>
        <div class="bmc-col bmc-split">
          <div class="bmc-block">
            <h4>Relacionamento</h4>
            <textarea v-model="localData.customerRelationships" placeholder="Que tipo de relacionamento cada segmento de cliente espera?"></textarea>
          </div>
          <div class="bmc-block mt">
            <h4>Canais</h4>
            <textarea v-model="localData.channels" placeholder="Através de quais canais seus clientes querem ser alcançados?"></textarea>
          </div>
        </div>
        <div class="bmc-col bmc-cs">
          <div class="bmc-block">
            <h4>Segmentos de Clientes</h4>
            <textarea v-model="localData.customerSegments" placeholder="Para quem estamos criando valor? Quem são nossos clientes mais importantes?"></textarea>
          </div>
        </div>
      </div>

      <!-- Row 2: Cost Structure, Revenue Streams -->
      <div class="bmc-bottom-row">
        <div class="bmc-block bmc-bottom-half">
          <h4>Estrutura de Custos</h4>
          <textarea v-model="localData.costStructure" placeholder="Quais são os custos mais importantes inerentes ao seu modelo de negócio?"></textarea>
        </div>
        <div class="bmc-block bmc-bottom-half">
          <h4>Fontes de Receita</h4>
          <textarea v-model="localData.revenueStreams" placeholder="Pelo que os clientes estão realmente dispostos a pagar?"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  initialData: string;
}>();

const emit = defineEmits<{
  (e: 'save', data: string): void;
}>();

const localData = ref({
  keyPartners: '',
  keyActivities: '',
  keyResources: '',
  valuePropositions: '',
  customerRelationships: '',
  channels: '',
  customerSegments: '',
  costStructure: '',
  revenueStreams: ''
});

onMounted(() => {
  if (props.initialData && props.initialData !== '{}') {
    try {
      const parsed = JSON.parse(props.initialData);
      localData.value = { ...localData.value, ...parsed };
    } catch (e) {
      console.error('Erro ao fazer parse dos dados do BMC', e);
    }
  }
});

function save() {
  emit('save', JSON.stringify(localData.value));
}
</script>

<style scoped>
.bmc-canvas-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.bmc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bmc-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.bmc-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-height: 500px;
}

.bmc-top-row {
  display: flex;
  flex: 2;
  gap: 0.5rem;
}

.bmc-col {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bmc-split {
  display: flex;
  flex-direction: column;
}

.bmc-split .bmc-block {
  flex: 1;
}

.mt {
  margin-top: 0.5rem;
}

.bmc-bottom-row {
  display: flex;
  flex: 1;
  gap: 0.5rem;
}

.bmc-bottom-half {
  flex: 1;
}

.bmc-block {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--surface-color);
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  height: 100%;
}

.bmc-block h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.25rem;
}

.bmc-block textarea {
  flex: 1;
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: 0.85rem;
  color: var(--text-color);
  outline: none;
  line-height: 1.4;
}

.bmc-block textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}
</style>
