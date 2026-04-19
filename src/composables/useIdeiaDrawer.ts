import { ref, reactive, computed, type Ref } from 'vue';
import type { Ideia, IdeiaStatus, IdeiaNote, IdeiaLink, IdeiaArquivo, IdeiaCorrelacao } from '../types/ideia';

// ─── Tipos de callback que o componente hospedeiro fornece ─────────────────────
export interface DrawerCallbacks {
  onStatusChange: (id: string, status: IdeiaStatus) => Promise<void>;
  onEdit: (ideia: Ideia) => void;
  onToggleFavorita: (ideia: Ideia) => Promise<void>;
  onToggleArquivada: (ideia: Ideia) => Promise<void>;
  onDuplicate: (ideia: Ideia) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  getHistorico: (id: string) => Promise<any[]>;
  updateAcesso: (id: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onNavigate?: (path: string) => void;
  onCreateDerivada?: (parentId: string) => void;
}

// ─── Composable ────────────────────────────────────────────────────────────────
export function useIdeiaDrawer(ideias: Ref<Ideia[]>, callbacks: DrawerCallbacks) {

  // ─── Estado do Drawer ───────────────────────────────────────────────────────
  const drawerIdeia = ref<Ideia | null>(null);
  const drawerTab = ref<'geral' | 'doc' | 'conexoes'>('geral');
   const historicoIdeia = ref<any[]>([]);
 
   // ─── Modal de Confirmação ────────────────────────────────────────────────
   const confirmDialog = reactive({
     show: false,
     title: '',
     message: '',
     type: 'primary' as 'primary' | 'danger',
     icon: '⚠️',
     resolve: null as ((val: boolean) => void) | null,
   });
 
   function solicitarConfirmacao(title: string, message: string, type: 'primary' | 'danger' = 'danger', icon = '🗑️'): Promise<boolean> {
     confirmDialog.title = title;
     confirmDialog.message = message;
     confirmDialog.type = type;
     confirmDialog.icon = icon;
     confirmDialog.show = true;
     return new Promise((resolve) => {
       confirmDialog.resolve = resolve;
     });
   }
 
   function handleConfirmResult(result: boolean) {
     if (confirmDialog.resolve) confirmDialog.resolve(result);
     confirmDialog.show = false;
     confirmDialog.resolve = null;
   }

  // ─── Conexões (Ecossistema Geral) ──────────────────────────────────────────
  const correlacoes = ref<IdeiaCorrelacao[]>([]);
  const novaCorrelacaoForm = reactive({ ideia_id: '', descricao: '' });

  const ideiasParaConectar = computed(() => {
    if (!drawerIdeia.value) return [];
    const connectedIds = new Set(correlacoes.value.map(c => c.correlata_id));
    return ideias.value.filter(i => i.id !== drawerIdeia.value!.id && !connectedIds.has(i.id) && !i.is_arquivada);
  });

  async function carregarCorrelacoes(id: string) {
    try {
      const api = (window as any).electronAPI;
      correlacoes.value = await api.correlacoes.getAll(id);
    } catch (e) {
      console.error('Erro ao buscar correlacoes:', e);
    }
  }

  async function criarCorrelacao() {
    if (!novaCorrelacaoForm.ideia_id || !drawerIdeia.value) return;
    try {
      const api = (window as any).electronAPI;
      await api.correlacoes.create({
        ideia_a_id: drawerIdeia.value.id,
        ideia_b_id: novaCorrelacaoForm.ideia_id,
        descricao: novaCorrelacaoForm.descricao,
      });
      await carregarCorrelacoes(drawerIdeia.value.id);
      novaCorrelacaoForm.ideia_id = '';
      novaCorrelacaoForm.descricao = '';
      callbacks.showToast('Conexão estabelecida com sucesso!');
    } catch (e) {
      console.error('Erro ao criar correlacao:', e);
      callbacks.showToast('Erro ao criar conexão', 'error');
    }
  }

  async function deleteCorrelacao(id: string) {
    const ok = await solicitarConfirmacao('Remover conexão?', 'Deseja realmente remover esta conexão? Ela desaparecerá do ecossistema geral.');
    if (!ok) return;
    try {
      const api = (window as any).electronAPI;
      await api.correlacoes.delete(id);
      if (drawerIdeia.value) await carregarCorrelacoes(drawerIdeia.value.id);
      callbacks.showToast('Conexão removida.');
    } catch (e) {
      console.error('Erro ao deletar correlacao:', e);
    }
  }

  // ─── Ecossistema ────────────────────────────────────────────────────────────
  const ideiaPai = computed(() => {
    if (!drawerIdeia.value?.parent_id) return null;
    return ideias.value.find(i => i.id === drawerIdeia.value?.parent_id) || null;
  });

  const ideiasFilhas = computed(() => {
    if (!drawerIdeia.value) return [];
    return ideias.value.filter(i => i.parent_id === drawerIdeia.value?.id);
  });

  const ecosistemaArvore = computed(() => {
    if (!drawerIdeia.value) return [];

    const encontrarRaiz = (ideia: Ideia): Ideia => {
      if (!ideia.parent_id) return ideia;
      const pai = ideias.value.find(i => i.id === ideia.parent_id);
      return pai ? encontrarRaiz(pai) : ideia;
    };

    const raiz = encontrarRaiz(drawerIdeia.value);
    const currentId = drawerIdeia.value.id;
    const arr: Array<Ideia & { depth: number; isCurrent: boolean }> = [];
    const visitados = new Set<string>();

    const inserir = (ideia: Ideia, depth: number) => {
      if (visitados.has(ideia.id)) return;
      visitados.add(ideia.id);
      arr.push({ ...ideia, depth, isCurrent: ideia.id === currentId });
      const filhos = ideias.value
        .filter(i => i.parent_id === ideia.id)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      for (const filho of filhos) {
        inserir(filho, depth + 1);
      }
    };

    inserir(raiz, 0);
    return arr;
  });

  // ─── Documentação ──────────────────────────────────────────────────────────
  const docTab = ref<'notas' | 'links' | 'arquivos'>('notas');
  const notas = ref<IdeiaNote[]>([]);
  const links = ref<IdeiaLink[]>([]);
  const arquivos = ref<IdeiaArquivo[]>([]);

  // Notas
  const addingNote = ref(false);
  const editingNoteId = ref<string | null>(null);
   const newNoteForm = reactive({ titulo: '', conteudo: '', cor: '#fef9c3' });
   const noteEditForm = reactive({ titulo: '', conteudo: '', cor: '#fef9c3' });
 
   const viewingNote = ref<IdeiaNote | null>(null);

  // Links
  const addingLink = ref(false);
  const linkErro = ref('');
  const newLinkForm = reactive({ url: '', titulo: '', descricao: '' });

  // Arquivos
  const fileInputRef = ref<HTMLInputElement | null>(null);
  const uploadando = ref(false);
  const uploadProgress = ref(0);

  async function carregarDocumentacao(ideia_id: string) {
    const api = (window as any).electronAPI;
    const [n, l, a] = await Promise.all([
      api.notas.getAll(ideia_id),
      api.links.getAll(ideia_id),
      api.arquivos.getAll(ideia_id),
    ]);
    notas.value = n ?? [];
    links.value = l ?? [];
    arquivos.value = a ?? [];
  }

  // ── Notas ───────────────────────────────────────────────────────────────────
  function openAddNote() {
    Object.assign(newNoteForm, { titulo: '', conteudo: '', cor: '#fef9c3' });
    addingNote.value = true;
  }

  async function saveNewNote() {
    if (!newNoteForm.conteudo.trim() || !drawerIdeia.value) return;
    const api = (window as any).electronAPI;
    const nota = await api.notas.create({
      ideia_id: drawerIdeia.value.id,
      titulo: newNoteForm.titulo.trim() || null,
      conteudo: newNoteForm.conteudo.trim(),
      cor: newNoteForm.cor,
    });
    notas.value.unshift(nota);
    addingNote.value = false;
    callbacks.showToast('Nota salva!');
  }

  function startEditNote(nota: IdeiaNote) {
    editingNoteId.value = nota.id;
    Object.assign(noteEditForm, { titulo: nota.titulo ?? '', conteudo: nota.conteudo, cor: nota.cor });
  }

  async function saveEditNote(id: string) {
    const api = (window as any).electronAPI;
    const updated = await api.notas.update({
      id,
      titulo: noteEditForm.titulo.trim() || null,
      conteudo: noteEditForm.conteudo.trim(),
      cor: noteEditForm.cor,
    });
    const idx = notas.value.findIndex(n => n.id === id);
    if (idx !== -1) notas.value[idx] = updated;
    editingNoteId.value = null;
    callbacks.showToast('Nota atualizada!');
  }

  async function deleteNota(id: string) {
    const ok = await solicitarConfirmacao('Excluir nota?', 'Esta ação não pode ser desfeita e o conteúdo será permanentemente removido.');
    if (!ok) return;
    try {
      const api = (window as any).electronAPI;
      await api.notas.delete(id);
      notas.value = notas.value.filter(n => n.id !== id);
      callbacks.showToast('Nota removida.');
    } catch (e) {
      console.error('Erro ao deletar nota:', e);
    }
  }

  // ── Links ───────────────────────────────────────────────────────────────────
  async function saveNewLink() {
    linkErro.value = '';
    if (!newLinkForm.url.trim()) { linkErro.value = 'URL é obrigatória.'; return; }
    try { new URL(newLinkForm.url.trim()); } catch { linkErro.value = 'URL inválida.'; return; }
    if (!drawerIdeia.value) return;
    const api = (window as any).electronAPI;
    const link = await api.links.create({
      ideia_id: drawerIdeia.value.id,
      url: newLinkForm.url.trim(),
      titulo: newLinkForm.titulo.trim() || null,
      descricao: newLinkForm.descricao.trim() || null,
    });
    links.value.unshift(link);
    Object.assign(newLinkForm, { url: '', titulo: '', descricao: '' });
    addingLink.value = false;
    callbacks.showToast('Link adicionado!');
  }

  async function deleteLink(id: string) {
    const ok = await solicitarConfirmacao('Excluir link?', 'Deseja remover este link da documentação?');
    if (!ok) return;
    try {
      const api = (window as any).electronAPI;
      await api.links.delete(id);
      links.value = links.value.filter(l => l.id !== id);
      callbacks.showToast('Link removido.');
    } catch (e) {
      console.error('Erro ao deletar link:', e);
    }
  }

  function openExternalLink(url: string) {
    window.open(url);
  }

  // ── Arquivos ────────────────────────────────────────────────────────────────
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !drawerIdeia.value) return;
    const api = (window as any).electronAPI;
    uploadando.value = true;
    uploadProgress.value = 0;
    const files = Array.from(input.files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const saved = await api.arquivos.save(
        drawerIdeia.value.id,
        file.name,
        base64,
        file.type,
        file.size,
      );
      arquivos.value.unshift(saved);
      uploadProgress.value = Math.round(((i + 1) / files.length) * 100);
    }
    uploadando.value = false;
    input.value = '';
    callbacks.showToast(`${files.length} arquivo(s) anexado(s)!`);
  }

  async function openArquivo(id: string) {
    const api = (window as any).electronAPI;
    await api.arquivos.open(id);
  }

  async function deleteArquivo(id: string) {
    const ok = await solicitarConfirmacao('Excluir arquivo?', 'O arquivo será removido permanentemente do seu computador.');
    if (!ok) return;
    try {
      const api = (window as any).electronAPI;
      await api.arquivos.delete(id);
      arquivos.value = arquivos.value.filter(a => a.id !== id);
      callbacks.showToast('Arquivo removido.');
    } catch (e) {
      console.error('Erro ao deletar arquivo:', e);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function fileIcon(mime?: string): string {
    if (!mime) return '📄';
    if (mime.startsWith('image/')) return '🖼️';
    if (mime === 'application/pdf') return '📕';
    if (mime.includes('word')) return '📘';
    if (mime.includes('sheet') || mime.includes('excel')) return '📗';
    if (mime.includes('presentation') || mime.includes('powerpoint')) return '📙';
    if (mime.startsWith('video/')) return '🎬';
    if (mime.startsWith('audio/')) return '🎵';
    return '📄';
  }

  function formatBytes(bytes?: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function allTags(ideia: Ideia): string[] {
    return [
      ...ideia.tags_avatar,
      ...ideia.tags_nicho,
      ...ideia.tags_dor,
      ...ideia.tags_desejo,
      ...ideia.tags_mecanismo,
    ];
  }

  function statusLabel(status: IdeiaStatus): string {
    const map: Record<IdeiaStatus, string> = {
      bruta: 'Bruta',
      em_teste: 'Em Teste',
      validada: 'Validada',
      nao_validada: 'Não Validada',
      escalada: 'Escalada',
    };
    return map[status] ?? status;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────
  async function abrirDrawer(ideia: Ideia) {
    drawerTab.value = 'geral';
    drawerIdeia.value = ideia;
    historicoIdeia.value = await callbacks.getHistorico(ideia.id);
    await callbacks.updateAcesso(ideia.id);
    await carregarDocumentacao(ideia.id);
    await carregarCorrelacoes(ideia.id);
  }

  function fecharDrawer() {
    drawerIdeia.value = null;
    drawerTab.value = 'geral';
    notas.value = [];
    links.value = [];
    arquivos.value = [];
    correlacoes.value = [];
    addingNote.value = false;
    addingLink.value = false;
    editingNoteId.value = null;
  }

  // ─── Ações do drawer (wrappers) ─────────────────────────────────────────────
  async function mudarStatus(id: string, status: IdeiaStatus) {
    await callbacks.onStatusChange(id, status);
    if (drawerIdeia.value?.id === id) {
      drawerIdeia.value = { ...drawerIdeia.value, status };
      historicoIdeia.value = await callbacks.getHistorico(id);
    }
  }

  async function handleToggleFavorita(ideia: Ideia) {
    await callbacks.onToggleFavorita(ideia);
    if (drawerIdeia.value?.id === ideia.id) {
      drawerIdeia.value = { ...drawerIdeia.value, is_favorita: !ideia.is_favorita };
    }
  }

  async function handleToggleArquivar(ideia: Ideia) {
    await callbacks.onToggleArquivada(ideia);
    if (drawerIdeia.value?.id === ideia.id) {
      drawerIdeia.value = { ...drawerIdeia.value, is_arquivada: !ideia.is_arquivada };
    }
    if (!ideia.is_arquivada) fecharDrawer();
  }

  async function handleDuplicar(ideia: Ideia) {
    await callbacks.onDuplicate(ideia);
    fecharDrawer();
  }

  async function confirmarDelete(id: string) {
    const ok = await solicitarConfirmacao('Excluir ideia?', 'Esta ação excluirá permanentemente a ideia, suas notas, links e arquivos anexos. Não há como desfazer.');
    if (!ok) return;
    await callbacks.onDelete(id);
    fecharDrawer();
  }

  function cadastrarDerivada() {
    if (!drawerIdeia.value) return;
    if (callbacks.onCreateDerivada) {
      callbacks.onCreateDerivada(drawerIdeia.value.id);
    }
  }

  // ─── Constantes ──────────────────────────────────────────────────────────────
  const NOTE_COLORS = ['#fef9c3', '#fce7f3', '#dbeafe', '#dcfce7', '#ffe4e6', '#ede9fe', '#f1f5f9'];
  const STATUS_OPTIONS = [
    { value: 'bruta' as IdeiaStatus, label: 'Bruta' },
    { value: 'em_teste' as IdeiaStatus, label: 'Em Teste' },
    { value: 'validada' as IdeiaStatus, label: 'Validada' },
    { value: 'nao_validada' as IdeiaStatus, label: 'Não Validada' },
    { value: 'escalada' as IdeiaStatus, label: 'Escalada' },
  ];

  return {
    // Estado
    drawerIdeia,
    drawerTab,
    historicoIdeia,
    correlacoes,
    novaCorrelacaoForm,
    ideiasParaConectar,
    ideiaPai,
    ideiasFilhas,
    ecosistemaArvore,
    docTab,
    notas,
    links,
    arquivos,
    addingNote,
    editingNoteId,
    newNoteForm,
    noteEditForm,
    addingLink,
    linkErro,
    newLinkForm,
    viewingNote,
    fileInputRef,
    uploadando,
    uploadProgress,
    confirmDialog,

    // Operações
    abrirDrawer,
    fecharDrawer,
    mudarStatus,
    handleToggleFavorita,
    handleToggleArquivar,
    handleDuplicar,
    confirmarDelete,
    cadastrarDerivada,
    criarCorrelacao,
    deleteCorrelacao,
    openAddNote,
    saveNewNote,
    startEditNote,
    saveEditNote,
    deleteNota,
    saveNewLink,
    deleteLink,
    openExternalLink,
    onFileSelected,
    openArquivo,
    deleteArquivo,
    carregarCorrelacoes,
    handleConfirmResult,

    // Helpers
    fileIcon,
    formatBytes,
    allTags,
    statusLabel,
    formatDate,

    // Constantes
    NOTE_COLORS,
    STATUS_OPTIONS,
  };
}
