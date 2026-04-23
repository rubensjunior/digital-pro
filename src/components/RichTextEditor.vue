<template>
  <div class="dp-editor-container" :class="{ 'is-focused': isFocused, 'is-loading': uploading }">
    <!-- Toolbar -->
    <div class="dp-editor-toolbar">
      <div class="dp-toolbar-group">
        <button 
          v-for="btn in toolbarButtons" 
          :key="btn.action"
          type="button"
          class="dp-toolbar-btn"
          :class="{ 'active': btn.isActive() }"
          @click="btn.run()"
          :title="btn.title"
        >
          <span v-html="btn.icon"></span>
        </button>
      </div>

      <div class="dp-toolbar-group">
        <button 
          type="button" 
          class="dp-toolbar-btn" 
          @click="setLink" 
          :class="{ 'active': editor?.isActive('link') }"
          title="Inserir Link"
        >
          <span>🔗</span>
        </button>
        <button 
          type="button" 
          class="dp-toolbar-btn btn-danger-ghost" 
          @click="editor?.chain().focus().unsetLink().run()" 
          v-if="editor?.isActive('link')"
          title="Remover Link"
        >
          <span>🔓</span>
        </button>
      </div>

      <div class="dp-toolbar-group">
        <button 
          type="button" 
          class="dp-toolbar-btn" 
          @click="triggerImageUpload"
          title="Inserir Imagem"
        >
          <span>🖼️</span>
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <editor-content :editor="editor" class="dp-editor-content" />
    
    <!-- Hidden File Input -->
    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept="image/*" 
      @change="onFileSelected"
    />

    <!-- Loading Overlay -->
    <div v-if="uploading" class="dp-editor-loader">
      <div class="spinner-sm"></div>
      <span>Processando imagem...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  ideiaId?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const isFocused = ref(false);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: { levels: [3] },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'dp-editor-link' },
    }),
    Image.configure({
      allowBase64: true,
      HTMLAttributes: { class: 'dp-editor-image' },
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  onFocus: () => { isFocused.value = true; },
  onBlur: () => { isFocused.value = false; },
  editorProps: {
    handleDrop: (view, event, slice, moved) => {
      if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith('image/')) { handleImageUpload(file); return true; }
      }
      return false;
    },
    handlePaste: (view, event) => {
      if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
        const file = event.clipboardData.files[0];
        if (file.type.startsWith('image/')) { handleImageUpload(file); return true; }
      }
      return false;
    },
  },
});

watch(() => props.modelValue, (newValue) => {
  if (editor.value?.getHTML() === newValue) return;
  editor.value?.commands.setContent(newValue, false);
});

onBeforeUnmount(() => { editor.value?.destroy(); });

const toolbarButtons = [
  {
    title: 'Negrito',
    icon: '<b>B</b>',
    action: 'bold',
    run: () => editor.value?.chain().focus().toggleBold().run(),
    isActive: () => editor.value?.isActive('bold') ?? false,
  },
  {
    title: 'Itálico',
    icon: '<i>I</i>',
    action: 'italic',
    run: () => editor.value?.chain().focus().toggleItalic().run(),
    isActive: () => editor.value?.isActive('italic') ?? false,
  },
  {
    title: 'Sublinhado',
    icon: '<u>U</u>',
    action: 'underline',
    run: () => editor.value?.chain().focus().toggleUnderline().run(),
    isActive: () => editor.value?.isActive('underline') ?? false,
  },
  {
    title: 'Título',
    icon: '<small>H3</small>',
    action: 'heading',
    run: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: () => editor.value?.isActive('heading', { level: 3 }) ?? false,
  },
  {
    title: 'Lista de Marcadores',
    icon: '•',
    action: 'bulletList',
    run: () => editor.value?.chain().focus().toggleBulletList().run(),
    isActive: () => editor.value?.isActive('bulletList') ?? false,
  },
  {
    title: 'Lista Numerada',
    icon: '1.',
    action: 'orderedList',
    run: () => editor.value?.chain().focus().toggleOrderedList().run(),
    isActive: () => editor.value?.isActive('orderedList') ?? false,
  },
  {
    title: 'Citação',
    icon: '“',
    action: 'blockquote',
    run: () => editor.value?.chain().focus().toggleBlockquote().run(),
    isActive: () => editor.value?.isActive('blockquote') ?? false,
  },
];

function setLink() {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = window.prompt('URL do link:', previousUrl);
  if (url === null) return;
  if (url === '') { editor.value?.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

function triggerImageUpload() { fileInput.value?.click(); }

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) handleImageUpload(input.files[0]);
  input.value = '';
}

async function handleImageUpload(file: File) {
  if (!props.ideiaId) return;
  uploading.value = true;
  try {
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const base64 = await base64Promise;
    const api = (window as any).electronAPI;
    const saved = await api.arquivos.save(props.ideiaId, file.name, base64, file.type, file.size);
    if (saved && saved.caminho) {
      const fileName = saved.caminho.split(/[\\/]/).pop();
      const url = `brainvault://${props.ideiaId}/${encodeURIComponent(fileName)}`;
      editor.value?.chain().focus().setImage({ src: url, alt: file.name }).run();
    }
  } catch (e) { console.error('Erro ao processar imagem:', e); }
  finally { uploading.value = false; }
}
</script>

<style scoped>
.dp-editor-container {
  display: flex;
  flex-direction: column;
  background: var(--dp-modal-bg);
  border: 1px solid var(--dp-modal-border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  position: relative;
}

.dp-editor-container.is-focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dp-editor-loader {
  position: absolute;
  inset: 0;
  background: rgba(var(--dp-modal-bg-rgb, 255, 255, 255), 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 10;
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
  backdrop-filter: blur(2px);
}

.dp-editor-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background: rgba(0,0,0,0.02);
  border-bottom: 1px solid var(--dp-modal-border);
}
.dark .dp-editor-toolbar { background: rgba(255,255,255,0.02); }

.dp-toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 4px;
  border-right: 1px solid var(--dp-modal-border);
}
.dp-toolbar-group:last-child { border-right: none; }

.dp-toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--dp-modal-text-secondary);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.dp-toolbar-btn:hover { background: rgba(0,0,0,0.05); color: var(--dp-modal-text-primary); }
.dark .dp-toolbar-btn:hover { background: rgba(255,255,255,0.05); }

.dp-toolbar-btn.active { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

.btn-danger-ghost:hover { color: #f1416c; background: rgba(241, 65, 108, 0.1); }

.dp-editor-content {
  padding: 12px 16px;
  min-height: 150px;
  cursor: text;
}

:deep(.ProseMirror) {
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: var(--dp-modal-text-primary);
  min-height: 150px;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: var(--dp-modal-text-secondary);
  pointer-events: none;
  height: 0;
  opacity: 0.5;
}

:deep(.dp-editor-image) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 16px 0;
  border: 1px solid var(--dp-modal-border);
}

:deep(.dp-editor-link) {
  color: #3b82f6;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.spinner-sm {
  width: 16px; height: 16px;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
