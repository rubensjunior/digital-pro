<template>
  <div class="modern-color-picker" ref="pickerRef">
    <!-- Gatilho (A própria bolinha de cor) -->
    <div 
      class="color-trigger" 
      :style="{ background: modelValue || '#cbd5e1' }"
      @click.stop="togglePopover"
      title="Selecionar Cor"
    ></div>

    <!-- Popover -->
    <Teleport to="body">
      <div 
        v-if="isOpen" 
        class="color-popover" 
        :style="popoverStyle"
        @click.stop
      >
        <div class="popover-header">
          <span>Escolha uma cor</span>
          <button @click="closePopover" class="close-btn">&times;</button>
        </div>

        <div class="palette-grid">
          <div 
            v-for="color in PALETTE" 
            :key="color"
            class="color-swatch"
            :class="{ active: modelValue === color }"
            :style="{ background: color }"
            @click="selectColor(color)"
          ></div>
        </div>

        <div class="picker-footer">
          <div class="hex-input-group">
            <span class="hex-prefix">#</span>
            <input 
              type="text" 
              v-model="hexValue" 
              class="hex-input" 
              placeholder="FFFFFF"
              @input="handleHexInput"
            />
          </div>
          <label class="native-picker-btn">
             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
             <input type="color" :value="modelValue" @input="handleNativeInput" />
          </label>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();

const pickerRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const hexValue = ref(props.modelValue?.replace('#', '') || '');
const popoverCoord = ref({ top: 0, left: 0 });

const PALETTE = [
  // Vermelhos/Pinks
  '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#f472b6', '#ec4899', '#db2777', '#be185d',
  // Laranjas/Amarelos
  '#fb923c', '#f97316', '#ea580c', '#c2410c', '#fbbf24', '#f59e0b', '#d97706', '#b45309',
  // Verdes
  '#4ade80', '#22c55e', '#16a34a', '#15803d', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e',
  // Azuis
  '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#818cf8', '#6366f1', '#4f46e5', '#4338ca',
  // Roxos/Modernos
  '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#94a3b8', '#64748b', '#475569', '#1e293b'
];

const popoverStyle = computed(() => ({
  top: `${popoverCoord.value.top}px`,
  left: `${popoverCoord.value.left}px`
}));

// Posicionamento dinâmico com "Smart Flip"
function updatePosition() {
  if (pickerRef.value) {
    const rect = pickerRef.value.getBoundingClientRect();
    const popoverHeight = 280; // Altura aproximada do seletor
    const margin = 8;
    
    let top = rect.bottom + window.scrollY + margin;
    
    // Verifica se o seletor sairia da tela por baixo
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < popoverHeight + margin) {
      // Se houver espaço em cima, inverte
      if (rect.top > popoverHeight + margin) {
        top = rect.top + window.scrollY - popoverHeight - margin;
      } else {
        // Se não couber em nenhum lugar, tenta o melhor ajuste no fundo
        top = Math.max(window.scrollY + 10, window.scrollY + window.innerHeight - popoverHeight - 20);
      }
    }

    popoverCoord.value = {
      top,
      left: rect.left + window.scrollX - 250 + rect.width
    };
    
    // Ajuste horizontal (evita sair da tela à direita ou esquerda)
    if (popoverCoord.value.left + 280 > window.innerWidth) {
      popoverCoord.value.left = Math.max(10, window.innerWidth - 300);
    }
    if (popoverCoord.value.left < 10) {
      popoverCoord.value.left = 10;
    }
  }
}

function togglePopover(e: Event) {
  e.stopPropagation(); // Evita que o clique no gatilho feche o popover imediatamente
  if (!isOpen.value) {
    updatePosition();
    isOpen.value = true;
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    document.addEventListener('click', handleClickOutside);
  } else {
    closePopover();
  }
}

function closePopover() {
  isOpen.value = false;
  window.removeEventListener('scroll', updatePosition, true);
  window.removeEventListener('resize', updatePosition);
  document.removeEventListener('click', handleClickOutside);
}

function handleClickOutside(e: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) {
    closePopover();
  }
}

function selectColor(color: string) {
  emit('update:modelValue', color);
  hexValue.value = color.replace('#', '');
  closePopover();
}

function handleHexInput() {
  let val = hexValue.value;
  if (val.length === 3 || val.length === 6) {
    emit('update:modelValue', '#' + val);
  }
}

function handleNativeInput(e: Event) {
  const color = (e.target as HTMLInputElement).value;
  emit('update:modelValue', color.toUpperCase());
  hexValue.value = color.replace('#', '').toUpperCase();
}

watch(() => props.modelValue, (newVal) => {
  hexValue.value = newVal?.replace('#', '').toUpperCase() || '';
});

onUnmounted(() => {
  closePopover();
});
</script>

<style scoped>
.modern-color-picker {
  position: relative;
  display: inline-block;
}

.color-trigger {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.color-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 1px #cbd5e1, 0 4px 12px rgba(0,0,0,0.1);
}

.color-popover {
  position: absolute;
  z-index: 99999;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  width: 280px;
  padding: 16px;
  border: 1px solid #e4e6ef;
  animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.popover-header span {
  font-size: 13px;
  font-weight: 700;
  color: #181c32;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #a1a5b7;
  cursor: pointer;
  line-height: 1;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.color-swatch {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.1s;
  border: 1px solid rgba(0,0,0,0.05);
}

.color-swatch:hover {
  transform: scale(1.15);
  z-index: 1;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.color-swatch.active {
  border: 2px solid #181c32;
  transform: scale(1.15);
}

.picker-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #f1f1f4;
}

.hex-input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background: #f5f8fa;
  border-radius: 6px;
  padding: 0 10px;
}

.hex-prefix {
  color: #a1a5b7;
  font-size: 13px;
  font-weight: 600;
  margin-right: 4px;
}

.hex-input {
  width: 100%;
  background: none;
  border: none;
  padding: 8px 0;
  font-size: 12px;
  font-weight: 700;
  color: #181c32;
  outline: none;
  text-transform: uppercase;
}

.native-picker-btn {
  width: 32px;
  height: 32px;
  background: #f1faff;
  color: #009ef7;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.native-picker-btn:hover {
  background: #009ef7;
  color: #fff;
}

.native-picker-btn input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
