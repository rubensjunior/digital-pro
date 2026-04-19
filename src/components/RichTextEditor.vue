<template>
  <div class="bv-editor-container" :class="{ 'is-focused': isFocused, 'is-loading': uploading }">
    <!-- Toolbar -->
    <div class="bv-editor-toolbar">
      <div class="bv-toolbar-group">
        <button 
          v-for="btn in toolbarButtons" 
          :key="btn.action"
          type="button"
          class="bv-toolbar-btn"
          :class="{ 'is-active': btn.isActive() }"
          @click="btn.run()"
          :title="btn.title"
        >
          <span v-html="btn.icon"></span>
        </button>
      </div>

      <div class="bv-toolbar-group">
        <button 
          type="button" 
          class="bv-toolbar-btn" 
          @click="setLink" 
          :class="{ 'is-active': editor?.isActive('link') }"
          title="Inserir Link"
        >
          <span>🔗</span>
        </button>
        <button 
          type="button" 
          class="bv-toolbar-btn" 
          @click="editor?.chain().focus().unsetLink().run()" 
          v-if="editor?.isActive('link')"
          title="Remover Link"
        >
          <span>🔓</span>
        </button>
      </div>

      <div class="bv-toolbar-group">
        <button 
          type="button" 
          class="bv-toolbar-btn" 
          @click="triggerImageUpload"
          title="Inserir Imagem"
        >
          <span>🖼️</span>
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <editor-content :editor="editor" class="bv-editor-content" />
    
    <!-- Hidden File Input -->
    <input 
      type="file" 
      ref="fileInput" 
      style="display: none" 
      accept="image/*" 
      @change="onFileSelected"
    />

    <!-- Loading Overlay -->
    <div v-if="uploading" class="bv-editor-loader">
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
  ideiaId?: string; // Necessário para salvar o anexo na pasta correta
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
      heading: {
        levels: [3],
      },
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'bv-editor-link',
      },
    }),
    Image.configure({
      allowBase64: true, // Permitimos base64 temporariamente antes do upload, ou para imagens externas
      HTMLAttributes: {
        class: 'bv-editor-image',
      },
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  onFocus: () => {
    isFocused.value = true;
  },
  onBlur: () => {
    isFocused.value = false;
  },
  editorProps: {
    handleDrop: (view, event, slice, moved) => {
      if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          handleImageUpload(file);
          return true; // Event handled
        }
      }
      return false;
    },
    handlePaste: (view, event) => {
      if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
        const file = event.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleImageUpload(file);
          return true; // Event handled
        }
      }
      return false;
    },
  },
});

// Watch for external content changes
watch(() => props.modelValue, (newValue) => {
  const isSame = editor.value?.getHTML() === newValue;
  if (isSame) return;
  editor.value?.commands.setContent(newValue, false);
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

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
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

function triggerImageUpload() {
  fileInput.value?.click();
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    handleImageUpload(input.files[0]);
  }
  input.value = '';
}

async function handleImageUpload(file: File) {
  if (!props.ideiaId) {
    console.error('ID da ideia não fornecido para o upload de imagem.');
    return;
  }

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
    
    // Salva o arquivo na pasta de anexos
    const saved = await api.arquivos.save(
      props.ideiaId,
      file.name,
      base64,
      file.type,
      file.size
    );

    if (saved && saved.caminho) {
      // Extrai o nome do arquivo gerado (UUID.ext) do caminho absoluto
      // O caminho retornado pelo main.ts usa path.join, então pode ter \ ou /
      const fileName = saved.caminho.split(/[\\/]/).pop();
      
      // Monta a URL usando o protocolo customizado brainvault://
      // Formato: brainvault://<ideiaId>/<fileName>
      const url = `brainvault://${props.ideiaId}/${encodeURIComponent(fileName)}`;
      
      editor.value?.chain().focus().setImage({ src: url, alt: file.name }).run();
    }
  } catch (e) {
    console.error('Erro ao processar imagem:', e);
  } finally {
    uploading.value = false;
  }
}
</script>

<style>
.bv-editor-container {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.15s ease;
  position: relative;
}

.bv-editor-container.is-focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.bv-editor-container.is-loading {
  opacity: 0.7;
  pointer-events: none;
}

.bv-editor-loader {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-size: 12px;
  font-weight: 600;
  color: #3b82f6;
  backdrop-filter: blur(1px);
}

.bv-editor-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.bv-toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 4px;
  border-right: 1px solid #e2e8f0;
}

.bv-toolbar-group:last-child {
  border-right: none;
}

.bv-toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.1s;
}

.bv-toolbar-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.bv-toolbar-btn.is-active {
  background: #dbeafe;
  color: #2563eb;
}

.bv-editor-content {
  padding: 8px 12px;
  min-height: 120px;
  cursor: text;
}

/* Tiptap editor internal styles */
.ProseMirror {
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  color: #1e293b;
  min-height: 120px;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #94a3b8;
  pointer-events: none;
  height: 0;
}

.ProseMirror h3 { font-size: 1.1em; font-weight: 700; margin: 1em 0 0.5em; color: #0f172a; }
.ProseMirror ul, .ProseMirror ol { padding-left: 1.2em; margin: 0.5em 0; }
.ProseMirror li { margin-bottom: 0.2em; }
.ProseMirror blockquote { border-left: 3px solid #cbd5e1; padding-left: 1em; margin: 1em 0; color: #64748b; font-style: italic; }
.ProseMirror a { color: #3b82f6; text-decoration: underline; cursor: pointer; }

.bv-editor-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 10px 0;
  border: 1px solid #e2e8f0;
}
</style>
