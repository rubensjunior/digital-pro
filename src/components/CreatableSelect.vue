<template>
  <div class="creatable-select-container" ref="containerRef">
    <label v-if="label" class="dp-label">{{ label }}</label>
    
    <div class="select-wrapper" :class="{ 'is-open': isOpen, 'has-error': hasError }">
      <input
        type="text"
        class="dp-input select-input"
        :placeholder="placeholder"
        v-model="searchQuery"
        @focus="handleFocus"
        @input="handleInput"
        @keydown.down.prevent="moveHighlight(1)"
        @keydown.up.prevent="moveHighlight(-1)"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="closeDropdown"
      />
      
      <div class="select-arrow">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </div>

      <div v-if="isOpen" class="select-dropdown dp-custom-scrollbar">
        <!-- Resultados Agrupados -->
        <template v-if="groupedResults.length > 0">
          <div v-for="group in groupedResults" :key="group.label" class="select-group">
            <div class="group-label">{{ group.label }}</div>
            <div
              v-for="option in group.options"
              :key="option.id"
              class="select-option"
              :class="{ 'is-highlighted': highlightedId === option.id, 'is-selected': modelValue === option.id }"
              @click="selectOption(option)"
              @mouseenter="highlightedId = option.id"
            >
              <span class="option-label">{{ option.label }}</span>
              <svg v-if="modelValue === option.id" class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </template>

        <!-- Resultados Simples (sem grupo) -->
        <template v-else-if="filteredOptions.length > 0">
          <div
            v-for="option in filteredOptions"
            :key="option.id"
            class="select-option"
            :class="{ 'is-highlighted': highlightedId === option.id, 'is-selected': modelValue === option.id }"
            @click="selectOption(option)"
            @mouseenter="highlightedId = option.id"
          >
            <span class="option-label">{{ option.label }}</span>
            <svg v-if="modelValue === option.id" class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        </template>

        <!-- Opção de Criar -->
        <div v-if="canCreate" class="create-option" @click="handleCreate">
          <div class="create-plus">+</div>
          <div class="create-text">
            Criar novo: <strong>{{ searchQuery }}</strong>
          </div>
        </div>

        <div v-if="filteredOptions.length === 0 && groupedResults.length === 0 && !canCreate" class="no-results">
          Nenhum resultado encontrado
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

interface Option {
  id: string;
  label: string;
  grupo?: string;
}

interface GroupedOption {
  label: string;
  options: Option[];
}

const props = defineProps<{
  modelValue: string;
  options: Option[] | GroupedOption[];
  placeholder?: string;
  label?: string;
  hasError?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'create', label: string): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const searchQuery = ref('');
const highlightedId = ref<string | null>(null);

// Normalizar opções para busca
const flatOptions = computed(() => {
  if (props.options.length === 0) return [];
  if ('options' in props.options[0]) {
    return (props.options as GroupedOption[]).flatMap(g => g.options);
  }
  return props.options as Option[];
});

// Atualizar searchQuery quando o modelValue muda
watch(() => props.modelValue, (newVal) => {
  const selected = flatOptions.value.find(o => o.id === newVal);
  if (selected) {
    searchQuery.value = selected.label;
  } else if (!newVal) {
    searchQuery.value = '';
  }
}, { immediate: true });

// Filtragem
const filteredOptions = computed(() => {
  if (!searchQuery.value || !isOpen.value) return flatOptions.value;
  return flatOptions.value.filter(o => 
    o.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const groupedResults = computed(() => {
  if (props.options.length === 0 || !('options' in props.options[0])) return [];
  
  const results: GroupedOption[] = [];
  (props.options as GroupedOption[]).forEach(group => {
    const matchedOptions = group.options.filter(o => 
      o.label.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
    if (matchedOptions.length > 0) {
      results.push({ label: group.label, options: matchedOptions });
    }
  });
  return results;
});

const canCreate = computed(() => {
  if (!searchQuery.value) return false;
  const exactMatch = flatOptions.value.some(o => o.label.toLowerCase() === searchQuery.value.toLowerCase());
  return !exactMatch;
});

// Ações
function handleFocus() {
  isOpen.value = true;
  if (props.modelValue) {
    const selected = flatOptions.value.find(o => o.id === props.modelValue);
    if (selected && searchQuery.value === selected.label) {
      // Opcional: Limpar ao focar para facilitar busca
      // searchQuery.value = '';
    }
  }
}

function handleInput() {
  isOpen.value = true;
  highlightedId.value = null;
}

function selectOption(option: Option) {
  searchQuery.value = option.label;
  emit('update:modelValue', option.id);
  closeDropdown();
}

function handleCreate() {
  if (!searchQuery.value) return;
  emit('create', searchQuery.value);
  closeDropdown();
}

function closeDropdown() {
  isOpen.value = false;
  highlightedId.value = null;
  // Se nada foi selecionado e o input não bate com nada, reseta para o valor anterior
  const selected = flatOptions.value.find(o => o.id === props.modelValue);
  if (selected) {
    searchQuery.value = selected.label;
  } else {
    searchQuery.value = '';
  }
}

// Navegação por teclado
function moveHighlight(direction: number) {
  const options = filteredOptions.value;
  if (options.length === 0) return;
  
  const currentIndex = options.findIndex(o => o.id === highlightedId.value);
  let nextIndex = currentIndex + direction;
  
  if (nextIndex < 0) nextIndex = options.length - 1;
  if (nextIndex >= options.length) nextIndex = 0;
  
  highlightedId.value = options[nextIndex].id;
}

function selectHighlighted() {
  if (highlightedId.value) {
    const option = flatOptions.value.find(o => o.id === highlightedId.value);
    if (option) selectOption(option);
  } else if (canCreate.value) {
    handleCreate();
  }
}

// Fechar ao clicar fora
function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.creatable-select-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  width: 100%;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-input {
  cursor: text;
  padding-right: 40px;
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--dp-modal-text-secondary);
  pointer-events: none;
  transition: transform 0.2s;
}

.select-wrapper.is-open .select-arrow {
  transform: translateY(-50%) rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--dp-modal-bg);
  border: 1px solid var(--dp-modal-border);
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 280px;
  overflow-y: auto;
  padding: 8px;
  animation: dropdown-appear 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes dropdown-appear {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.select-group {
  margin-bottom: 8px;
}

.group-label {
  font-size: 10px;
  font-weight: 800;
  color: var(--dp-modal-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 12px 4px;
}

.select-option {
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--dp-modal-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s;
}

.select-option:hover, .select-option.is-highlighted {
  background: rgba(59, 130, 246, 0.08);
  color: #3b82f6;
}

.select-option.is-selected {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 600;
}

.check-icon {
  width: 16px;
  height: 16px;
}

.create-option {
  margin-top: 4px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px dashed rgba(59, 130, 246, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
}

.create-option:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.create-plus {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.create-text {
  font-size: 13px;
  color: var(--dp-modal-text-primary);
}

.no-results {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: var(--dp-modal-text-secondary);
}

/* Scrollbar Customization */
.dp-custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.dp-custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.dp-custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--dp-modal-border);
  border-radius: 10px;
}
.dp-custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--dp-modal-text-secondary);
}
</style>
