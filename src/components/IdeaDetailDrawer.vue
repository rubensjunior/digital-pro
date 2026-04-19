<template>
  <Teleport to="body">
    <div v-if="drawer.drawerIdeia.value" class="bv-drawer-overlay" @mousedown.self="onOverlayMouseDown" @mouseup.self="onOverlayMouseUp">
      <div class="bv-drawer">
        <div class="bv-drawer-header">
          <div style="display: flex; gap: 10px; align-items: flex-start; justify-content: space-between; width: 100%;">
            <div style="flex: 1;">
              <div class="bv-card-tipo-badge" :data-tipo="drawer.drawerIdeia.value.tipo">{{ drawer.drawerIdeia.value.tipo }}</div>
              <h2 class="bv-drawer-title">{{ drawer.drawerIdeia.value.nome }}</h2>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="bv-modal-close" style="font-size: 16px;" @click="drawer.handleToggleFavorita()">
                {{ drawer.drawerIdeia.value.is_favorita ? '⭐' : '☆' }}
              </button>
              <button class="bv-modal-close" @click="drawer.fecharDrawer()">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="bv-drawer-body">

          <!-- ═══════════════════════════ TABS DO DRAWER -->
          <div class="bv-drawer-tabs">
            <button :class="['bv-drawer-tab', { active: drawer.drawerTab.value === 'geral' }]" @click="drawer.drawerTab.value = 'geral'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Informações
            </button>
            <button :class="['bv-drawer-tab', { active: drawer.drawerTab.value === 'doc' }]" @click="drawer.drawerTab.value = 'doc'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Documentação
              <span v-if="drawer.notas.value.length + drawer.links.value.length + drawer.arquivos.value.length > 0" class="bv-drawer-tab-badge">{{ drawer.notas.value.length + drawer.links.value.length + drawer.arquivos.value.length }}</span>
            </button>
            <button :class="['bv-drawer-tab', { active: drawer.drawerTab.value === 'conexoes' }]" @click="drawer.drawerTab.value = 'conexoes'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              Conexões
              <span v-if="drawer.correlacoes.value.length > 0" class="bv-drawer-tab-badge">{{ drawer.correlacoes.value.length }}</span>
            </button>
            <button class="bv-drawer-tab bv-drawer-tab-neural" @click="$emit('navigate', `/dashboard/ideas/flowchart/${drawer.drawerIdeia.value!.id}`)" title="Ver como Fluxograma">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM9 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM9 8v4h6V8" /></svg>
              Fluxograma
            </button>
            <button class="bv-drawer-tab bv-drawer-tab-neural" @click="$emit('navigate', `/dashboard/ideas/network/${drawer.drawerIdeia.value!.id}`)" title="Ver como Rede Neural">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Rede Neural
            </button>
          </div>

          <!-- ══════════════════════════ ABA: INFORMAÇÕES -->
          <div v-show="drawer.drawerTab.value === 'geral'" class="bv-drawer-tab-pane">

            <!-- Status + Score -->
            <div class="bv-drawer-row">
              <span 
                class="bv-status-badge" 
                :data-status="drawer.drawerIdeia.value.status"
              >
                {{ drawer.statusLabel(drawer.drawerIdeia.value.status) }}
              </span>
              <div class="bv-stars">
                <span v-for="n in 4" :key="n" :class="n <= drawer.drawerIdeia.value.score ? 'bv-star-on' : 'bv-star-off'">★</span>
              </div>
            </div>


            <!-- Ecossistema -->
            <div class="bv-drawer-section" v-if="drawer.ecosistemaArvore.value.length > 1 || drawer.ideiasFilhas.value.length > 0">
              <div class="bv-drawer-section-title">Ecossistema da Ideia</div>
              <div class="bv-eco-tree">
                <div
                  v-for="no in drawer.ecosistemaArvore.value"
                  :key="no.id"
                  class="bv-eco-node"
                  :class="{
                    'bv-eco-node-root':    no.depth === 0 && !no.isCurrent,
                    'bv-eco-node-current': no.isCurrent,
                    'bv-eco-node-child':   no.depth > 0 && !no.isCurrent,
                  }"
                  :style="{ paddingLeft: (no.depth * 20 + 12) + 'px' }"
                  @click="!no.isCurrent && drawer.abrirDrawer(no)"
                >
                  <span v-if="no.depth > 0" class="bv-eco-connector">↳</span>
                  <span class="bv-eco-dot" :class="{
                    'bv-eco-dot-root':    no.depth === 0,
                    'bv-eco-dot-current': no.isCurrent,
                  }"></span>
                  <div class="bv-eco-info">
                    <div v-if="no.relationship_type && no.depth > 0" class="bv-eco-rel">{{ no.relationship_type }}</div>
                    <div class="bv-eco-nome">{{ no.nome }}<span v-if="no.isCurrent" class="bv-eco-current-badge"> · atual</span></div>
                    <div class="bv-eco-meta">
                      <span class="bv-eco-tipo">{{ no.tipo }}</span>
                      <span class="bv-status-badge bv-status-sm" :data-status="no.status">{{ drawer.statusLabel(no.status) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style="display: flex; gap: 8px; margin-top: 10px;">
                <button class="bv-btn-ghost bv-btn-sm" style="flex: 1; justify-content: center;" @click="drawer.cadastrarDerivada()">
                  + Nova Derivada
                </button>
                <button class="bv-btn-primary bv-btn-sm" style="flex: 1; justify-content: center;" @click="$emit('navigate', `/dashboard/ideas/kanban/${drawer.drawerIdeia.value!.id}`)">
                  👁️ Admin Kanban
                </button>
              </div>
            </div>
            <div class="bv-drawer-section" v-else>
              <div class="bv-drawer-section-title">Ecossistema da Ideia</div>
              <div style="display: flex; gap: 8px;">
                <button class="bv-btn-ghost" style="flex: 1; justify-content: center;" @click="drawer.cadastrarDerivada()">
                  + Criar Ideia Derivada
                </button>
                <button class="bv-btn-primary" style="flex: 1; justify-content: center;" @click="$emit('navigate', `/dashboard/ideas/kanban/${drawer.drawerIdeia.value!.id}`)">
                  👁️ Admin Kanban
                </button>
              </div>
            </div>

            <!-- Campos descritivos -->
            <div v-if="drawer.drawerIdeia.value.descricao" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Descrição</div>
              <p class="bv-drawer-text">{{ drawer.drawerIdeia.value.descricao }}</p>
            </div>
            <div v-if="drawer.drawerIdeia.value.contexto" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Contexto</div>
              <p class="bv-drawer-text">{{ drawer.drawerIdeia.value.contexto }}</p>
            </div>
            <div v-if="drawer.drawerIdeia.value.problema" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Problema que resolve</div>
              <p class="bv-drawer-text">{{ drawer.drawerIdeia.value.problema }}</p>
            </div>
            <div v-if="drawer.drawerIdeia.value.transformacao" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Transformação prometida</div>
              <p class="bv-drawer-text">{{ drawer.drawerIdeia.value.transformacao }}</p>
            </div>
            <div v-if="drawer.drawerIdeia.value.publico_alvo" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Público-alvo</div>
              <p class="bv-drawer-text">{{ drawer.drawerIdeia.value.publico_alvo }}</p>
            </div>

            <!-- Tags -->
            <div v-if="drawer.allTags(drawer.drawerIdeia.value).length > 0" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Tags</div>
              <div class="bv-drawer-tags">
                <span v-for="t in drawer.allTags(drawer.drawerIdeia.value)" :key="t" class="bv-tag">{{ t }}</span>
              </div>
            </div>

            <!-- Histórico -->
            <div v-if="drawer.historicoIdeia.value.length > 0" class="bv-drawer-section">
              <div class="bv-drawer-section-title">Histórico de Alterações</div>
              <div class="bv-historico-list">
                <div v-for="h in drawer.historicoIdeia.value" :key="h.id" class="bv-historico-item">
                  <div class="bv-historico-date">{{ drawer.formatDate(h.created_at) }}</div>
                  <div class="bv-historico-acao">
                    <strong>{{ h.acao }}</strong>
                    <span v-if="h.detalhes" class="bv-historico-detalhes"> — {{ h.detalhes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bv-drawer-date">Criada em {{ drawer.formatDate(drawer.drawerIdeia.value.created_at) }}</div>
            <div class="bv-drawer-date" v-if="drawer.drawerIdeia.value.last_accessed_at">Último acesso: {{ drawer.formatDate(drawer.drawerIdeia.value.last_accessed_at) }}</div>

          </div><!-- /aba geral -->

          <!-- ══════════════════════════ ABA: DOCUMENTAÇÃO -->
          <div v-show="drawer.drawerTab.value === 'doc'" class="bv-drawer-tab-pane">

            <!-- SUB-ABAS -->
            <div class="bv-doc-tabs">
              <button :class="['bv-doc-tab', { active: drawer.docTab.value === 'notas' }]"   @click="drawer.docTab.value = 'notas'">📝 Notas ({{ drawer.notas.value.length }})</button>
              <button :class="['bv-doc-tab', { active: drawer.docTab.value === 'links' }]"   @click="drawer.docTab.value = 'links'">🔗 Links ({{ drawer.links.value.length }})</button>
              <button :class="['bv-doc-tab', { active: drawer.docTab.value === 'arquivos' }]" @click="drawer.docTab.value = 'arquivos'">📁 Arquivos ({{ drawer.arquivos.value.length }})</button>
            </div>

            <!-- NOTAS -->
            <div v-show="drawer.docTab.value === 'notas'" class="bv-doc-pane">
              <div class="bv-notas-list">
                <div
                  v-for="nota in drawer.notas.value"
                  :key="nota.id"
                  class="bv-nota-item"
                >
                  <div v-if="drawer.editingNoteId.value !== nota.id" class="bv-nota-view" @dblclick="drawer.startEditNote(nota)">
                    <div class="bv-nota-icon" :style="{ backgroundColor: nota.cor || '#e2e8f0' }"></div>
                    <div class="bv-nota-info" @click="drawer.viewingNote.value = nota">
                      <div v-if="nota.titulo" class="bv-nota-titulo">{{ nota.titulo }}</div>
                      <div class="bv-nota-conteudo bv-rich-text bv-nota-preview" v-html="nota.conteudo"></div>
                    </div>
                    <div class="bv-nota-actions">
                      <button class="bv-nota-action-btn" @click.stop="drawer.viewingNote.value = nota" title="Visualizar">👁️</button>
                      <button class="bv-nota-action-btn" @click.stop="drawer.startEditNote(nota)" title="Editar">✏️</button>
                      <button class="bv-nota-action-btn" @click.stop="drawer.deleteNota(nota.id)" title="Excluir">🗑️</button>
                    </div>
                  </div>
                  <div v-else class="bv-link-form" style="margin: 0; border: none; padding: 10px;">
                    <input v-model="drawer.noteEditForm.titulo" class="bv-doc-input" placeholder="Título (opcional)" />
                    <RichTextEditor v-model="drawer.noteEditForm.conteudo" :ideia-id="drawer.drawerIdeia.value?.id" style="margin-bottom: 8px;" />
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                      <div class="bv-cor-group">
                        <button v-for="c in drawer.NOTE_COLORS" :key="c" class="bv-cor-btn" :style="{background:c}" :class="{active: drawer.noteEditForm.cor === c}" @click="drawer.noteEditForm.cor = c" type="button"/>
                      </div>
                      <div style="display:flex;gap:6px">
                        <button class="bv-nota-save-btn" @click="drawer.saveEditNote(nota.id)" type="button">Salvar</button>
                        <button class="bv-nota-cancel-btn" @click="drawer.editingNoteId.value = null" type="button">Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form de nova nota -->
                <div v-if="drawer.addingNote.value" class="bv-link-form">
                  <input v-model="drawer.newNoteForm.titulo" class="bv-doc-input" placeholder="Título (opcional)" />
                  <RichTextEditor v-model="drawer.newNoteForm.conteudo" :ideia-id="drawer.drawerIdeia.value?.id" style="margin-bottom: 8px;" />
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                    <div class="bv-cor-group">
                      <button v-for="c in drawer.NOTE_COLORS" :key="c" class="bv-cor-btn" :style="{background:c}" :class="{active: drawer.newNoteForm.cor === c}" @click="drawer.newNoteForm.cor = c" type="button"/>
                    </div>
                    <div style="display:flex;gap:6px">
                      <button class="bv-nota-save-btn" @click="drawer.saveNewNote" type="button">Salvar</button>
                      <button class="bv-nota-cancel-btn" @click="drawer.addingNote.value = false" type="button">Cancelar</button>
                    </div>
                  </div>
                </div>
                
                <div v-if="drawer.notas.value.length === 0 && !drawer.addingNote.value" class="bv-doc-empty">Nenhuma nota adicionada</div>
              </div>

              <!-- Botão + Nota -->
              <button v-if="!drawer.addingNote.value" class="bv-doc-add-btn" @click="drawer.openAddNote" type="button">+ Nova Nota</button>
            </div>

            <!-- LINKS -->
            <div v-show="drawer.docTab.value === 'links'" class="bv-doc-pane">
              <div class="bv-links-list">
                <div v-for="link in drawer.links.value" :key="link.id" class="bv-link-item">
                  <div class="bv-link-icon">🔗</div>
                  <div class="bv-link-info">
                    <a class="bv-link-url" :href="link.url" @click.prevent="drawer.openExternalLink(link.url)">{{ link.titulo || link.url }}</a>
                    <div v-if="link.titulo" class="bv-link-sub">{{ link.url }}</div>
                    <div v-if="link.descricao" class="bv-link-desc">{{ link.descricao }}</div>
                  </div>
                  <button class="bv-link-del" @click="drawer.deleteLink(link.id)" title="Remover">🗑️</button>
                </div>

                <!-- Form novo link -->
                <div v-if="drawer.addingLink.value" class="bv-link-form">
                  <input v-model="drawer.newLinkForm.url" class="bv-doc-input" placeholder="URL *" type="url" />
                  <input v-model="drawer.newLinkForm.titulo" class="bv-doc-input" placeholder="Título (opcional)" type="text" />
                  <input v-model="drawer.newLinkForm.descricao" class="bv-doc-input" placeholder="Descrição breve (opcional)" type="text" />
                  <span v-if="drawer.linkErro.value" class="bv-doc-error">{{ drawer.linkErro.value }}</span>
                  <div style="display:flex;gap:6px;margin-top:4px">
                    <button class="bv-nota-save-btn" @click="drawer.saveNewLink" type="button">Salvar</button>
                    <button class="bv-nota-cancel-btn" @click="drawer.addingLink.value = false; drawer.linkErro.value = ''" type="button">Cancelar</button>
                  </div>
                </div>

                <div v-if="drawer.links.value.length === 0 && !drawer.addingLink.value" class="bv-doc-empty">Nenhum link adicionado</div>
              </div>
              <button v-if="!drawer.addingLink.value" class="bv-doc-add-btn" @click="drawer.addingLink.value = true" type="button">+ Novo Link</button>
            </div>

            <!-- ARQUIVOS -->
            <div v-show="drawer.docTab.value === 'arquivos'" class="bv-doc-pane">
              <input ref="fileInputRefEl" type="file" style="display:none" @change="drawer.onFileSelected" multiple />
              <div class="bv-files-list">
                <div v-for="arq in drawer.arquivos.value" :key="arq.id" class="bv-file-item">
                  <div class="bv-file-icon">{{ drawer.fileIcon(arq.tipo_mime) }}</div>
                  <div class="bv-file-info">
                    <div class="bv-file-nome">{{ arq.nome_original }}</div>
                    <div class="bv-file-meta">{{ drawer.formatBytes(arq.tamanho) }}</div>
                  </div>
                  <div class="bv-file-actions">
                    <button class="bv-file-btn" @click="drawer.openArquivo(arq.id)" title="Abrir">📂</button>
                    <button class="bv-file-btn" @click="drawer.deleteArquivo(arq.id)" title="Excluir">🗑️</button>
                  </div>
                </div>
                <div v-if="drawer.arquivos.value.length === 0 && !drawer.uploadando.value" class="bv-doc-empty">Nenhum arquivo anexado</div>
                <div v-if="drawer.uploadando.value" class="bv-upload-progress">
                  <div class="bv-upload-bar"><div class="bv-upload-fill" :style="{width: drawer.uploadProgress.value + '%'}"></div></div>
                  <span>Enviando... {{ drawer.uploadProgress.value }}%</span>
                </div>
              </div>
              <button class="bv-doc-add-btn" @click="fileInputRefEl?.click()" type="button" :disabled="drawer.uploadando.value">+ Anexar Arquivo</button>
            </div>

          </div><!-- /aba doc -->

          <!-- ══════════════════════════ ABA: CONEXÕES -->
          <div v-show="drawer.drawerTab.value === 'conexoes'" class="bv-drawer-tab-pane">
            <div class="bv-drawer-section">
              <div class="bv-drawer-section-title">Ideias Correlacionadas</div>
              <p class="bv-drawer-text" style="margin-bottom: 15px;">Conecte esta ideia a outras de forma livre, criando um Ecossistema Geral.</p>
              
              <div class="bv-cor-list" style="margin-bottom: 20px;">
                <div v-for="c in drawer.correlacoes.value" :key="c.id" class="bv-cor-item">
                  <div v-if="drawer.editingCorrelacaoId.value !== c.id" style="display:flex; justify-content: space-between; align-items: center;">
                    <div style="flex: 1; min-width: 0;">
                      <div style="display:flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                        <span class="bv-card-tipo-badge" :data-tipo="c.correlata_tipo" style="padding: 2px 6px; font-size: 10px;">{{ c.correlata_tipo }}</span>
                        <strong style="font-size: 13px; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">{{ c.correlata_nome }}</strong>
                      </div>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="bv-status-badge bv-status-sm" :data-status="c.correlata_status">{{ drawer.statusLabel(c.correlata_status as any) }}</span>
                        <span v-if="c.descricao" class="bv-historico-detalhes" style="font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;"> — {{ c.descricao }}</span>
                      </div>
                    </div>
                    <div class="bv-cor-actions">
                      <button class="bv-nota-action-btn" @click="abrirIdeiaCorrelata(c.correlata_id!)" title="Abrir Ideia">↗️</button>
                      <button class="bv-nota-action-btn" @click="drawer.startEditCorrelacao(c)" title="Editar">✏️</button>
                      <button class="bv-nota-action-btn" @click="drawer.deleteCorrelacao(c.id)" title="Desconectar">🗑️</button>
                    </div>
                  </div>
                  
                  <!-- Form de edição inline -->
                  <div v-else class="bv-link-form" style="margin: 0; border: none; padding: 0; background: transparent;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 8px;">Editando conexão com: {{ c.correlata_nome }}</div>
                    <input v-model="drawer.correlacaoEditForm.descricao" class="bv-doc-input" placeholder="Descrição da conexão (opcional)" style="margin-bottom: 8px;" />
                    <div style="display:flex; gap:6px; justify-content: flex-end;">
                      <button class="bv-nota-save-btn" @click="drawer.saveEditCorrelacao(c.id)" type="button">Salvar</button>
                      <button class="bv-nota-cancel-btn" @click="drawer.editingCorrelacaoId.value = null" type="button">Cancelar</button>
                    </div>
                  </div>
                </div>
                <div v-if="drawer.correlacoes.value.length === 0" class="bv-doc-empty">Nenhuma conexão estabelecida.</div>
              </div>

              <div class="bv-field" style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0;">
                <label class="bv-label">Adicionar Conexão</label>
                <select v-model="drawer.novaCorrelacaoForm.ideia_id" class="bv-input bv-select-field" style="margin-bottom: 10px;">
                  <option value="">Selecione uma ideia para conectar...</option>
                  <option v-for="i in drawer.ideiasParaConectar.value" :key="i.id" :value="i.id">
                    {{ i.nome }} ({{ i.tipo }})
                  </option>
                </select>
                <input v-model="drawer.novaCorrelacaoForm.descricao" class="bv-input" placeholder="Descrição da conexão (opcional)" style="margin-bottom: 10px;" />
                <button class="bv-btn-primary" style="width: 100%; justify-content: center;" @click="drawer.criarCorrelacao" :disabled="!drawer.novaCorrelacaoForm.ideia_id">
                  Conectar Ideia
                </button>
              </div>
            </div>
          </div><!-- /aba conexoes -->

        </div><!-- /bv-drawer-body -->

        <div class="bv-drawer-footer">
          <button class="bv-btn-ghost" @click="drawer.handleToggleArquivar(drawer.drawerIdeia.value!)" type="button">
            {{ drawer.drawerIdeia.value.is_arquivada ? 'Desarquivar' : 'Arquivar' }}
          </button>
          <button class="bv-btn-ghost" @click="drawer.handleDuplicar(drawer.drawerIdeia.value!)" type="button">Duplicar</button>
          <button class="bv-btn-danger" @click="drawer.confirmarDelete(drawer.drawerIdeia.value!.id)" type="button">Excluir</button>
          <button class="bv-btn-primary" @click="$emit('edit', drawer.drawerIdeia.value!)" type="button">Editar</button>
          <button v-if="showBrainVaultLink" class="bv-btn-ghost" @click="$emit('navigate', '/dashboard/ideas?openDrawer=' + drawer.drawerIdeia.value!.id)" type="button">Ver no Brain Vault</button>
        </div>
      </div>
    </div>
 
    <!-- Modal de Confirmação Personalizado -->
    <ConfirmModal 
      v-if="drawer.confirmDialog.show"
      :show="drawer.confirmDialog.show"
      :title="drawer.confirmDialog.title"
      :message="drawer.confirmDialog.message"
      :type="drawer.confirmDialog.type"
      :icon="drawer.confirmDialog.icon"
      @confirm="drawer.handleConfirmResult(true)"
      @cancel="drawer.handleConfirmResult(false)"
    />

    <NoteViewModal 
      v-if="drawer.viewingNote.value"
      :note="drawer.viewingNote.value"
      @close="drawer.viewingNote.value = null"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, toRef } from 'vue';
import { useIdeiaDrawer, type DrawerCallbacks } from '../composables/useIdeiaDrawer';
import type { Ideia, IdeiaStatus } from '../types/ideia';
import { useIdeias } from '../composables/useIdeias';
import RichTextEditor from './RichTextEditor.vue';
import ConfirmModal from './ConfirmModal.vue';
import NoteViewModal from './NoteViewModal.vue';

const props = defineProps<{
  ideias: Ideia[];
  showBrainVaultLink?: boolean;
}>();

const emit = defineEmits<{
  (e: 'edit', ideia: Ideia): void;
  (e: 'navigate', path: string): void;
  (e: 'close'): void;
  (e: 'createDerivada', parentId: string): void;
}>();

const { updateStatus, getHistorico, updateAcesso, toggleFavorita, toggleArquivada, duplicarIdeia, deleteIdeia } = useIdeias();

const fileInputRefEl = ref<HTMLInputElement | null>(null);

// Toast local (para uso standalone nas views de visualização)
const toastData = ref({ visible: false, message: '', type: 'success' });
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function localShowToast(msg: string, type: 'success' | 'error' = 'success') {
  toastData.value = { visible: true, message: msg, type };
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toastData.value.visible = false; }, 3000);
}

const drawerCallbacks: DrawerCallbacks = {
  onStatusChange: async (id: string, status: IdeiaStatus) => {
    await updateStatus(id, status);
  },
  onEdit: (ideia: Ideia) => {
    emit('edit', ideia);
  },
  onToggleFavorita: async (ideia: Ideia) => {
    const novoEstado = !ideia.is_favorita;
    await toggleFavorita(ideia.id, novoEstado);
    localShowToast(novoEstado ? 'Favoritada!' : 'Removida dos favoritos.');
  },
  onToggleArquivada: async (ideia: Ideia) => {
    const novoEstado = !ideia.is_arquivada;
    await toggleArquivada(ideia.id, novoEstado);
    localShowToast(novoEstado ? 'Ideia arquivada.' : 'Ideia desarquivada.');
  },
  onDuplicate: async (ideia: Ideia) => {
    const copia = await duplicarIdeia(ideia);
    if (copia) localShowToast('Ideia duplicada com sucesso!');
  },
  onDelete: async (id: string) => {
    const res = await deleteIdeia(id);
    if (res) {
      localShowToast('Ideia excluída com sucesso!');
    } else {
      localShowToast('Erro ao excluir ideia.', 'error');
    }
  },
  getHistorico,
  updateAcesso,
  showToast: localShowToast,
  onNavigate: (path: string) => {
    emit('navigate', path);
  },
  onCreateDerivada: (parentId: string) => {
    emit('createDerivada', parentId);
  },
};

const drawer = useIdeiaDrawer(toRef(props, 'ideias'), drawerCallbacks);

function abrirIdeiaCorrelata(id: string) {
  const ideia = props.ideias.find(i => i.id === id);
  if (ideia) drawer.abrirDrawer(ideia);
}



// Expõe para o componente pai
defineExpose({
  abrirDrawer: drawer.abrirDrawer,
  fecharDrawer: drawer.fecharDrawer,
  drawerIdeia: drawer.drawerIdeia,
});
</script>

<style scoped>
/* ═══════════════════════════════════ VARIÁVEIS */
.bv-drawer-overlay,
.bv-drawer {
  --bg: #f1f5f9;
  --surface: #ffffff;
  --border: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --accent: #3b82f6;
  --accent-end: #2563eb;
}

/* ═══════════════════════════════════ OVERLAY + DRAWER */
.bv-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: flex-end;
  z-index: 9998;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.bv-drawer {
  width: 50vw;
  max-width: calc(100vw - 40px);
  min-width: 480px;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: -12px 0 40px rgba(0,0,0,0.15);
  animation: slideRight 0.2s cubic-bezier(0.16,1,0.3,1);
  color: #1e293b;
}

@keyframes slideRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

.bv-drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

.bv-drawer-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 6px 0 0;
  line-height: 1.3;
}

.bv-drawer-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #f8fafc;
}

/* ════════════════════════════════ DRAWER TABS */
.bv-drawer-tabs {
  display: flex;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 20px;
  gap: 0;
  flex-shrink: 0;
}

.bv-drawer-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 14px 18px;
  font-size: 13.5px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.bv-drawer-tab svg { width: 15px; height: 15px; flex-shrink: 0; }
.bv-drawer-tab:hover { color: #1e293b; }
.bv-drawer-tab.active { color: #3b82f6; border-bottom-color: #3b82f6; }

.bv-drawer-tab-neural {
  margin-left: auto;
  color: #a855f7;
  font-weight: 700;
  border-bottom: 2.5px solid transparent;
}
.bv-drawer-tab-neural:hover { color: #9333ea; border-bottom-color: #9333ea; }
.bv-drawer-tab-neural svg { color: #a855f7; }

.bv-drawer-tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #3b82f6;
  color: #fff;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.bv-drawer-tab-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
}

.bv-drawer-row { display: flex; align-items: center; gap: 10px; }

.bv-drawer-section { display: flex; flex-direction: column; gap: 6px; }

.bv-drawer-section-title {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.bv-drawer-text { font-size: 13.5px; color: #1e293b; line-height: 1.55; margin: 0; }

.bv-drawer-tags { display: flex; flex-wrap: wrap; gap: 5px; }

.bv-drawer-date { font-size: 11.5px; color: #64748b; margin-top: auto; }

.bv-drawer-footer {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

/* ═══════════════════════════════════ BUTTONS */
.bv-btn-primary {
  display: inline-flex; align-items: center; gap: 6px;
  background: linear-gradient(135deg, var(--accent), var(--accent-end));
  color: #fff; border: none; border-radius: 9px;
  font-size: 13.5px; font-weight: 600; padding: 9px 16px;
  cursor: pointer; transition: opacity 0.15s, transform 0.1s;
  white-space: nowrap; flex-shrink: 0;
}
.bv-btn-primary:hover { opacity: 0.9; }
.bv-btn-primary:active { transform: scale(0.97); }
.bv-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

.bv-btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  background: transparent; color: var(--text-secondary);
  border: 1px solid var(--border); border-radius: 9px;
  font-size: 13.5px; font-weight: 500; padding: 9px 16px;
  cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0;
}
.bv-btn-ghost:hover { background: var(--border); color: var(--text-primary); }

.bv-btn-danger {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(239, 68, 68, 0.1); color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.25); border-radius: 9px;
  font-size: 13.5px; font-weight: 600; padding: 9px 16px;
  cursor: pointer; transition: all 0.15s;
}
.bv-btn-danger:hover { background: rgba(239, 68, 68, 0.2); }

.bv-btn-sm { font-size: 12px; padding: 6px 12px; border-radius: 8px; }

.bv-modal-close {
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  border: 1px solid #e2e8f0; background: transparent; color: #64748b;
  border-radius: 8px; cursor: pointer; transition: all 0.15s; flex-shrink: 0;
}
.bv-modal-close:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
.bv-modal-close svg { width: 15px; height: 15px; }

/* ═══════════════════════════════════ STATUS */
.bv-status-badge {
  display: inline-flex; align-items: center; padding: 3px 9px;
  border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
}
.bv-status-badge[data-status="bruta"]    { background: rgba(100,116,139,0.12); color: #94a3b8; }
.bv-status-badge[data-status="em_teste"] { background: rgba(234,179,8,0.12);   color: #eab308; }
.bv-status-badge[data-status="validada"] { background: rgba(34,197,94,0.12);   color: #22c55e; }
.bv-status-badge[data-status="escalada"] { background: rgba(59,130,246,0.12);  color: #60a5fa; }
.bv-status-badge[data-status="nao_validada"] { background: rgba(239,68,68,0.12); color: #ef4444; }
.bv-status-sm { font-size: 9px !important; padding: 1px 6px !important; border-radius: 4px !important; }


/* ═══════════════════════════════════ STARS & TAGS */
.bv-stars { display: flex; gap: 1px; font-size: 14px; }
.bv-star-on  { color: #f59e0b; }
.bv-star-off { color: var(--border); }

.bv-tag {
  display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 4px;
  font-size: 11px; font-weight: 500; background: var(--bg); color: var(--text-secondary); border: 1px solid var(--border);
}

.bv-card-tipo-badge {
  display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px;
  font-size: 11px; font-weight: 600; background: rgba(99,102,241,0.12); color: #818cf8;
  letter-spacing: 0.01em; width: fit-content;
}

/* ═══════════════════════════════════ ECOSSISTEMA */
.bv-eco-tree { display: flex; flex-direction: column; gap: 3px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 6px 0; overflow: hidden; }
.bv-eco-node { display: flex; align-items: flex-start; gap: 8px; padding-top: 8px; padding-bottom: 8px; padding-right: 12px; border-radius: 0; transition: background 0.15s; position: relative; cursor: pointer; }
.bv-eco-node:hover { background: rgba(139, 92, 246, 0.06); }
.bv-eco-node-root { border-bottom: 1px solid var(--border); margin-bottom: 2px; }
.bv-eco-node-current { background: rgba(139, 92, 246, 0.08); cursor: default; border-left: 3px solid var(--accent); }
.bv-eco-node-current:hover { background: rgba(139, 92, 246, 0.08); }
.bv-eco-connector { font-size: 14px; color: #94a3b8; flex-shrink: 0; line-height: 1.4; margin-top: 1px; }
.bv-eco-dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; flex-shrink: 0; margin-top: 5px; transition: background 0.15s; }
.bv-eco-dot-root { background: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
.bv-eco-dot-current { background: var(--accent); box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2); }
.bv-eco-node:hover .bv-eco-dot:not(.bv-eco-dot-root):not(.bv-eco-dot-current) { background: #8b5cf6; }
.bv-eco-info { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
.bv-eco-rel { font-size: 10px; color: #8b5cf6; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; line-height: 1; }
.bv-eco-nome { font-size: 13px; font-weight: 600; color: var(--text-primary); line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bv-eco-current-badge { font-size: 11px; font-weight: 400; color: var(--accent); margin-left: 4px; }
.bv-eco-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.bv-eco-tipo { font-size: 10px; color: #64748b; font-weight: 500; }

/* ═══════════════════════════════════ HISTORICO */
.bv-historico-list { display: flex; flex-direction: column; gap: 8px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; max-height: 250px; overflow-y: auto; }
.bv-historico-item { display: flex; flex-direction: column; gap: 2px; padding-bottom: 8px; border-bottom: 1px dashed #e2e8f0; }
.bv-historico-item:last-child { border-bottom: none; padding-bottom: 0; }
.bv-historico-date { font-size: 11px; color: #64748b; }
.bv-historico-acao { font-size: 13px; color: #1e293b; }
.bv-historico-acao strong { font-weight: 600; }
.bv-historico-detalhes { color: #64748b; font-style: italic; }

/* ═══════════════════════════════════ DOCUMENTAÇÃO */
.bv-doc-tabs { display: flex; gap: 4px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
.bv-doc-tab { padding: 5px 10px; font-size: 11.5px; font-weight: 600; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc; color: #64748b; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.bv-doc-tab:hover { color: #1e293b; border-color: #cbd5e1; }
.bv-doc-tab.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.bv-doc-pane { display: flex; flex-direction: column; gap: 8px; }
.bv-doc-add-btn { align-self: flex-start; padding: 6px 14px; font-size: 12.5px; font-weight: 600; background: rgba(59,130,246,0.08); color: #3b82f6; border: 1.5px dashed #93c5fd; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.bv-doc-add-btn:hover { background: rgba(59,130,246,0.14); border-style: solid; }
.bv-doc-add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.bv-doc-input { width: 100%; padding: 8px 11px; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #1e293b; outline: none; box-sizing: border-box; font-family: inherit; transition: border-color 0.15s; }
.bv-doc-input:focus { border-color: #3b82f6; }
.bv-doc-empty { font-size: 12.5px; color: #94a3b8; text-align: center; padding: 12px 0; font-style: italic; }
.bv-doc-error { font-size: 12px; color: #ef4444; margin-top: -4px; }

/* Notas */
.bv-notas-list { display: flex; flex-direction: column; gap: 6px; }
.bv-nota-item { display: flex; flex-direction: column; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 9px; transition: border-color 0.15s; overflow: hidden; }
.bv-nota-item:hover { border-color: #93c5fd; }
.bv-nota-view { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; }
.bv-nota-icon { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; margin-top: 2px; box-shadow: inset 0 0 0 2px rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.1); }
.bv-nota-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.bv-nota-titulo { font-size: 13px; font-weight: 600; color: #1e293b; line-height: 1.3; }
.bv-nota-conteudo { font-size: 13px; color: #475569; line-height: 1.5; word-break: break-word; position: relative; }
.bv-nota-preview {
  max-height: 130px;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
}
.bv-nota-preview :deep(img) {
  max-height: 100px;
  object-fit: cover;
  width: auto;
  opacity: 0.8;
}
.bv-nota-conteudo :deep(p) { margin: 0 0 0.5em; }
.bv-nota-conteudo :deep(p:last-child) { margin-bottom: 0; }
.bv-nota-conteudo :deep(h3) { font-size: 1.1em; font-weight: 700; margin: 0.8em 0 0.4em; color: #1e293b; }
.bv-nota-conteudo :deep(ul), .bv-nota-conteudo :deep(ol) { padding-left: 1.25em; margin: 0.5em 0; }
.bv-nota-conteudo :deep(li) { margin-bottom: 0.25em; }
.bv-nota-conteudo :deep(blockquote) { border-left: 3px solid #cbd5e1; padding-left: 1em; margin: 0.8em 0; color: #64748b; font-style: italic; }
.bv-nota-conteudo :deep(a) { color: #3b82f6; text-decoration: underline; }
.bv-rich-text :deep(img) { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; border: 1px solid #e2e8f0; display: block; }
.bv-nota-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
.bv-nota-item:hover .bv-nota-actions { opacity: 1; }
.bv-nota-action-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 4px; transition: transform 0.15s; }
.bv-nota-action-btn:hover { transform: scale(1.1); }
.bv-cor-group { display: flex; gap: 6px; }
.bv-cor-btn { width: 18px; height: 18px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; padding: 0; transition: transform 0.15s, border-color 0.15s; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.bv-cor-btn.active { border-color: #0f172a; transform: scale(1.15); }
.bv-nota-save-btn { padding: 6px 12px; font-size: 12px; font-weight: 600; background: #3b82f6; color: #fff; border: none; border-radius: 6px; cursor: pointer; transition: opacity 0.15s, transform 0.15s; }
.bv-nota-save-btn:hover { opacity: 0.9; transform: translateY(-1px); }
.bv-nota-cancel-btn { padding: 6px 10px; font-size: 12px; font-weight: 500; background: #f1f5f9; border: none; border-radius: 6px; cursor: pointer; color: #475569; transition: all 0.15s; }
.bv-nota-cancel-btn:hover { background: #e2e8f0; color: #0f172a; }

/* Links */
.bv-links-list { display: flex; flex-direction: column; gap: 6px; }
.bv-link-item { display: flex; align-items: flex-start; gap: 8px; padding: 10px 12px; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 9px; transition: border-color 0.15s; }
.bv-link-item:hover { border-color: #93c5fd; }
.bv-link-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
.bv-link-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.bv-link-url { font-size: 13px; font-weight: 600; color: #3b82f6; cursor: pointer; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
.bv-link-url:hover { text-decoration: underline; }
.bv-link-sub { font-size: 11px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bv-link-desc { font-size: 12px; color: #64748b; line-height: 1.4; }
.bv-link-del { background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 4px; opacity: 0; transition: opacity 0.15s; flex-shrink: 0; }
.bv-link-item:hover .bv-link-del { opacity: 1; }
.bv-link-form { display: flex; flex-direction: column; gap: 6px; padding: 12px; background: #f1f5f9; border-radius: 9px; border: 1.5px solid #e2e8f0; }

/* Arquivos */
.bv-files-list { display: flex; flex-direction: column; gap: 6px; }
.bv-file-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 9px; transition: border-color 0.15s; }
.bv-file-item:hover { border-color: #93c5fd; }
.bv-file-icon { font-size: 22px; flex-shrink: 0; }
.bv-file-info { flex: 1; min-width: 0; }
.bv-file-nome { font-size: 13px; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bv-file-meta { font-size: 11px; color: #94a3b8; margin-top: 1px; }
.bv-file-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
.bv-file-item:hover .bv-file-actions { opacity: 1; }
.bv-file-btn { background: rgba(0,0,0,0.05); border: none; border-radius: 6px; cursor: pointer; font-size: 14px; padding: 3px 6px; transition: background 0.15s; }
.bv-file-btn:hover { background: rgba(0,0,0,0.12); }
.bv-upload-progress { display: flex; flex-direction: column; gap: 4px; padding: 8px 0; }
.bv-upload-bar { width: 100%; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; }
.bv-upload-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #60a5fa); border-radius: 99px; transition: width 0.3s ease; }
.bv-upload-progress span { font-size: 11.5px; color: #64748b; }

/* Connections */
.bv-cor-list { display: flex; flex-direction: column; gap: 6px; }
.bv-cor-item { display: flex; flex-direction: column; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 9px; transition: border-color 0.15s; padding: 10px 12px; }
.bv-cor-item:hover { border-color: #93c5fd; }
.bv-cor-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; pointer-events: none; }
.bv-cor-item:hover .bv-cor-actions { opacity: 1; pointer-events: auto; }

/* Fields (for connections tab) */
.bv-field { display: flex; flex-direction: column; gap: 8px; }
.bv-label { font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 0.08em; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
.bv-input { padding: 11px 14px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 10px; color: #1e293b; font-size: 14px; outline: none; transition: border-color 0.15s, box-shadow 0.15s; width: 100%; box-sizing: border-box; font-family: inherit; }
.bv-input::placeholder { color: #94a3b8; opacity: 1; }
.bv-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
.bv-select-field { padding: 11px 36px 11px 14px; -webkit-appearance: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%2364748b' viewBox='0 0 24 24'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; background-size: 14px; background-color: #ffffff; cursor: pointer; }
</style>
