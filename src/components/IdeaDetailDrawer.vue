<template>
  <Teleport to="body">
    <div v-if="drawerIdeia" class="dp-modal-overlay drawer-overlay-align" @mousedown.self="onOverlayMouseDown" @mouseup.self="onOverlayMouseUp">
      <div class="dp-drawer-container">
        <div class="dp-modal-header drawer-header-spacing">
          <div class="drawer-header-content">
            <div class="drawer-header-top">
              <div class="drawer-header-badges">
                <div class="dp-badge dp-badge-indigo">{{ getTipoLabel(drawerIdeia.tipo) }}</div>
                <div class="dp-badge dp-badge-ghost">
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  {{ drawer.getWorkspaceName(drawerIdeia.workspace_id) }}
                </div>
              </div>
              <div class="drawer-actions">
                <button class="drawer-action-btn" @click="drawer.handleToggleFavorita(drawerIdeia!)" :title="drawerIdeia.is_favorita ? 'Remover dos Favoritos' : 'Favoritar'">
                  <svg v-if="drawerIdeia.is_favorita" fill="currentColor" viewBox="0 0 24 24" class="star-active"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  <svg v-else fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </button>
                <button class="drawer-action-btn" @click="$emit('edit', drawerIdeia!)" title="Editar Ideia">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
                <button class="drawer-close-btn" @click="drawer.fecharDrawer()" title="Fechar">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <h2 class="dp-modal-title drawer-main-title">{{ drawerIdeia.nome }}</h2>
          </div>
        </div>

        <div class="dp-modal-body drawer-body-padding">
          <!-- TABS -->
          <div class="dp-tabs">
            <button :class="['dp-tab', { active: drawerTab === 'geral' }]" @click="drawerTab = 'geral'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Informações
            </button>
            <button :class="['dp-tab', { active: drawerTab === 'doc' }]" @click="drawerTab = 'doc'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Documentação
              <span v-if="notas.length + links.length + arquivos.length > 0" class="dp-tab-badge">{{ notas.length + links.length + arquivos.length }}</span>
            </button>
            <button :class="['dp-tab', { active: drawerTab === 'conexoes' }]" @click="drawerTab = 'conexoes'">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
              Conexões
              <span v-if="correlacoes.length > 0" class="dp-tab-badge">{{ correlacoes.length }}</span>
            </button>
          </div>

          <!-- ABA: GERAL -->
          <div v-show="drawerTab === 'geral'" class="drawer-tab-pane">
            <div class="drawer-status-score-row">
              <div class="dp-input-wrapper status-select-custom">
                <select 
                  class="dp-input status-select-actual"
                  :value="drawerIdeia.status"
                  @change="drawer.mudarStatus(drawerIdeia.id, ($event.target as HTMLSelectElement).value)"
                >
                  <optgroup v-for="grupo in statusOptions" :key="grupo.label" :label="grupo.label">
                    <option v-for="opt in grupo.options" :key="opt.id" :value="opt.id">{{ opt.label }}</option>
                  </optgroup>
                </select>
                <div class="status-visual-badge" :style="{ backgroundColor: getStatusColor(drawerIdeia.status) || '#94a3b8' }">
                  {{ getStatusLabel(drawerIdeia.status) }}
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
              <div class="dp-score-stars">
                <span v-for="n in 4" :key="n" :class="n <= drawerIdeia.score ? 'star-on' : 'star-off'">★</span>
              </div>
            </div>

            <div class="drawer-section-card" v-if="ecosistemaArvore.length > 1 || ideiasFilhas.length > 0">
              <div class="section-title">Ecossistema da Ideia</div>
              <div class="eco-tree-container">
                <div
                  v-for="no in ecosistemaArvore"
                  :key="no.id"
                  class="eco-node-item"
                  :class="{ 'is-current': no.isCurrent }"
                  :style="{ paddingLeft: (no.depth * 20 + 16) + 'px' }"
                  @click="!no.isCurrent && abrirDrawer(no)"
                >
                  <span v-if="no.depth > 0" class="eco-node-arrow">↳</span>
                  <div class="eco-node-bullet" :style="{ backgroundColor: no.isCurrent ? 'var(--dp-modal-primary)' : '#cbd5e1' }"></div>
                  <div class="eco-node-content">
                    <div v-if="no.relationship_type && no.depth > 0" class="eco-node-rel">{{ no.relationship_type }}</div>
                    <div class="eco-node-name">{{ no.nome }} <span v-if="no.isCurrent" class="eco-current-text">· atual</span></div>
                    <div class="eco-node-meta">
                      <span>{{ getTipoLabel(no.tipo) }}</span>
                      <span class="dot-separator">•</span>
                      <span :style="{ color: getStatusColor(no.status) }">{{ getStatusLabel(no.status) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="eco-actions-grid">
                <button class="dp-btn dp-btn-ghost dp-btn-sm" @click="cadastrarDerivada()">+ Nova Derivada</button>
                <button class="dp-btn dp-btn-primary dp-btn-sm" @click="$emit('navigate', `/dashboard/ideas/kanban/${drawerIdeia!.id}`)">Admin Kanban</button>
              </div>
            </div>

            <div class="drawer-content-grid">
              <div v-if="drawerIdeia.descricao" class="content-item">
                <label>Descrição</label>
                <p>{{ drawerIdeia.descricao }}</p>
              </div>
              <div v-if="drawerIdeia.contexto" class="content-item">
                <label>Contexto</label>
                <p>{{ drawerIdeia.contexto }}</p>
              </div>
              <div v-if="drawerIdeia.problema" class="content-item">
                <label>Problema</label>
                <p>{{ drawerIdeia.problema }}</p>
              </div>
              <div v-if="drawerIdeia.transformacao" class="content-item">
                <label>Transformação</label>
                <p>{{ drawerIdeia.transformacao }}</p>
              </div>
            </div>

            <div v-if="allTags(drawerIdeia).length > 0" class="content-item">
              <label>Tags</label>
              <div class="dp-tags-list">
                <span v-for="t in allTags(drawerIdeia)" :key="t" class="dp-tag-chip">{{ t }}</span>
              </div>
            </div>

            <div v-if="historicoIdeia.length > 0" class="content-item">
              <label>Histórico</label>
              <div class="history-list-box">
                <div v-for="h in historicoIdeia" :key="h.id" class="history-item-row">
                  <span class="history-date">{{ formatDate(h.created_at) }}</span>
                  <div class="history-action">
                    <strong>{{ h.acao }}</strong>
                    <span v-if="h.detalhes" class="history-details"> — {{ h.detalhes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="drawer-footer-meta">
              <span>Criada em {{ formatDate(drawerIdeia.created_at) }}</span>
              <span v-if="drawerIdeia.last_accessed_at">Último acesso: {{ formatDate(drawerIdeia.last_accessed_at) }}</span>
            </div>
          </div>

          <!-- ABA: DOCUMENTAÇÃO -->
          <div v-show="drawerTab === 'doc'" class="drawer-tab-pane">
            <div class="dp-sub-tabs">
              <button :class="['sub-tab', { active: docTab === 'notas' }]" @click="docTab = 'notas'">Notas ({{ notas.length }})</button>
              <button :class="['sub-tab', { active: docTab === 'links' }]" @click="docTab = 'links'">Links ({{ links.length }})</button>
              <button :class="['sub-tab', { active: docTab === 'arquivos' }]" @click="docTab = 'arquivos'">Arquivos ({{ arquivos.length }})</button>
            </div>

            <!-- NOTAS -->
            <div v-show="docTab === 'notas'" class="doc-content-area">
              <div class="notas-grid">
                <div v-for="nota in notas" :key="nota.id" class="nota-card-premium">
                  <div v-if="editingNoteId !== nota.id" class="nota-card-view">
                    <div class="nota-card-accent" :style="{ backgroundColor: nota.cor || '#3b82f6' }"></div>
                    <div class="nota-card-main" @click="viewingNote = nota">
                      <div class="nota-card-header">
                        <span class="nota-card-title">{{ nota.titulo || 'Nota sem título' }}</span>
                        <div class="nota-card-actions">
                          <button @click.stop="viewingNote = nota" title="Visualizar"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
                          <button @click.stop="startEditNote(nota)" title="Editar"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                          <button class="btn-del" @click.stop="deleteNota(nota.id)" title="Excluir"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                        </div>
                      </div>
                      <div class="nota-card-preview" v-html="nota.conteudo"></div>
                    </div>
                  </div>
                  <div v-else class="nota-edit-form">
                    <input v-model="noteEditForm.titulo" class="dp-input" placeholder="Título..." />
                    <RichTextEditor v-model="noteEditForm.conteudo" :ideia-id="drawerIdeia?.id" />
                    <div class="form-footer-flex">
                      <div class="color-picker-mini">
                        <button v-for="c in drawer.NOTE_COLORS" :key="c.id" :style="{ background: c.value }" :class="{ active: noteEditForm.cor === c.value }" @click="noteEditForm.cor = c.value"></button>
                      </div>
                      <div class="form-btns">
                        <button class="dp-btn dp-btn-ghost dp-btn-sm" @click="editingNoteId = null">Cancelar</button>
                        <button class="dp-btn dp-btn-primary dp-btn-sm" @click="saveEditNote(nota.id)">Salvar</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Nova Nota -->
                <div v-if="addingNote" class="nota-edit-form adding-new">
                  <input v-model="newNoteForm.titulo" class="dp-input" placeholder="Título da nova nota..." />
                  <RichTextEditor v-model="newNoteForm.conteudo" :ideia-id="drawerIdeia?.id" />
                  <div class="form-footer-flex">
                    <div class="color-picker-mini">
                      <button v-for="c in drawer.NOTE_COLORS" :key="c.id" :style="{ background: c.value }" :class="{ active: newNoteForm.cor === c.value }" @click="newNoteForm.cor = c.value"></button>
                    </div>
                    <div class="form-btns">
                      <button class="dp-btn dp-btn-ghost dp-btn-sm" @click="addingNote = false">Cancelar</button>
                      <button class="dp-btn dp-btn-primary dp-btn-sm" @click="saveNewNote">Salvar Nota</button>
                    </div>
                  </div>
                </div>
              </div>
              <button v-if="!addingNote" class="dp-btn dp-btn-ghost add-doc-btn" @click="openAddNote">+ Adicionar Nota</button>
            </div>

            <!-- LINKS -->
            <div v-show="docTab === 'links'" class="doc-content-area">
              <div class="links-list-premium">
                <div v-for="link in links" :key="link.id" class="link-item-premium">
                  <div class="link-icon-box"><svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg></div>
                  <div class="link-info-box">
                    <a :href="link.url" @click.prevent="openExternalLink(link.url)" class="link-title-url">{{ link.titulo || link.url }}</a>
                    <span v-if="link.descricao" class="link-desc">{{ link.descricao }}</span>
                    <span class="link-url-text">{{ link.url }}</span>
                  </div>
                  <button class="btn-link-del" @click="deleteLink(link.id)" title="Remover Link"><svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                </div>
                <div v-if="addingLink" class="link-add-form-premium">
                  <input v-model="newLinkForm.url" class="dp-input" placeholder="URL do link (https://...)" type="url" />
                  <input v-model="newLinkForm.titulo" class="dp-input" placeholder="Título amigável..." type="text" />
                  <input v-model="newLinkForm.descricao" class="dp-input" placeholder="Breve descrição..." type="text" />
                  <div class="form-btns-right">
                    <button class="dp-btn dp-btn-ghost dp-btn-sm" @click="addingLink = false">Cancelar</button>
                    <button class="dp-btn dp-btn-primary dp-btn-sm" @click="saveNewLink">Salvar Link</button>
                  </div>
                </div>
              </div>
              <button v-if="!addingLink" class="dp-btn dp-btn-ghost add-doc-btn" @click="addingLink = true">+ Adicionar Link</button>
            </div>

            <!-- ARQUIVOS -->
            <div v-show="docTab === 'arquivos'" class="doc-content-area">
              <input ref="fileInputRefEl" type="file" style="display:none" @change="onFileSelected" multiple />
              <div class="files-grid-premium">
                <div v-for="arq in arquivos" :key="arq.id" class="file-item-premium">
                  <div class="file-icon-premium">{{ fileIcon(arq.tipo_mime) }}</div>
                  <div class="file-details">
                    <span class="file-name">{{ arq.nome_original }}</span>
                    <span class="file-size">{{ formatBytes(arq.tamanho) }}</span>
                  </div>
                  <div class="file-actions">
                    <button class="btn-file-open" @click="openArquivo(arq.id)" title="Abrir arquivo"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5l-2-2z"></path></svg></button>
                    <button class="btn-file-del" @click="deleteArquivo(arq.id)" title="Excluir arquivo"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                  </div>
                </div>
                <div v-if="uploadando" class="upload-status-card">
                  <div class="upload-bar-bg"><div class="upload-bar-fill" :style="{width: uploadProgress + '%'}"></div></div>
                  <span>Enviando arquivos... {{ uploadProgress }}%</span>
                </div>
              </div>
              <button class="dp-btn dp-btn-ghost add-doc-btn" @click="fileInputRefEl?.click()" :disabled="uploadando">+ Anexar Arquivos</button>
            </div>
          </div>

          <!-- ABA: CONEXÕES -->
          <div v-show="drawerTab === 'conexoes'" class="drawer-tab-pane">
            <div class="drawer-section-card">
              <div class="section-title">Conexões de Valor</div>
              <p class="section-subtitle">Mapeie como esta ideia interage com outros elementos do seu ecossistema.</p>
              
              <div class="connections-list-premium">
                <div v-for="c in correlacoes" :key="c.id" class="connection-item-premium">
                  <div v-if="editingCorrelacaoId !== c.id" class="connection-view">
                    <div class="conn-info">
                      <div class="conn-header">
                        <span class="dp-badge dp-badge-indigo" :style="{ backgroundColor: getTipoColor(c.correlata_tipo!) || undefined }">{{ getTipoLabel(c.correlata_tipo!) }}</span>
                        <strong class="conn-name">{{ c.correlata_nome }}</strong>
                      </div>
                      <div class="conn-meta">
                        <span class="conn-status" :style="{ color: getStatusColor(c.correlata_status!) }">{{ getStatusLabel(c.correlata_status!) }}</span>
                        <span v-if="c.descricao" class="conn-desc">— {{ c.descricao }}</span>
                      </div>
                    </div>
                    <div class="conn-actions">
                      <button @click="abrirIdeiaCorrelata(c.correlata_id!)" title="Ver Ideia"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></button>
                      <button @click="startEditCorrelacao(c)" title="Editar Conexão"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                      <button class="btn-del" @click="deleteCorrelacao(c.id)" title="Remover Conexão"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  </div>
                  <div v-else class="connection-edit-form">
                    <input v-model="correlacaoEditForm.descricao" class="dp-input" placeholder="Descreva esta conexão..." />
                    <div class="form-btns-right">
                      <button class="dp-btn dp-btn-ghost dp-btn-sm" @click="editingCorrelacaoId = null">Cancelar</button>
                      <button class="dp-btn dp-btn-primary dp-btn-sm" @click="saveEditCorrelacao(c.id)">Salvar</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="add-connection-box">
                <label class="dp-label">Nova Conexão</label>
                <div class="search-input-wrapper">
                  <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="search-icon"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input v-model="filtroConexao" class="dp-input" placeholder="Pesquisar ideias para conectar..." />
                </div>
                <select v-model="novaCorrelacaoForm.ideia_id" class="dp-input select-custom">
                  <option value="">Selecione a ideia...</option>
                  <option v-for="i in ideiasParaConectar" :key="i.id" :value="i.id">{{ i.nome }} ({{ getWorkspaceName(i.workspace_id) }})</option>
                </select>
                <input v-model="novaCorrelacaoForm.descricao" class="dp-input" placeholder="Contexto desta conexão (opcional)" />
                <button class="dp-btn dp-btn-primary" style="width: 100%" @click="criarCorrelacao" :disabled="!novaCorrelacaoForm.ideia_id">Conectar Agora</button>
              </div>
            </div>
          </div>
        </div>

        <div class="dp-modal-footer drawer-footer-btns">
          <div class="footer-left-group">
            <button class="dp-btn dp-btn-ghost" @click="handleToggleArquivar(drawerIdeia!)">{{ drawerIdeia.is_arquivada ? 'Desarquivar' : 'Arquivar' }}</button>
            <button class="dp-btn dp-btn-ghost" @click="handleDuplicar(drawerIdeia!)">Duplicar</button>
            <button class="dp-btn dp-btn-ghost btn-danger-text" @click="confirmarDelete(drawerIdeia!.id)">Excluir</button>
          </div>
          <div class="footer-right-group">
            <button v-if="showBrainVaultLink" class="dp-btn dp-btn-ghost" @click="$emit('navigate', '/dashboard/ideas?openDrawer=' + drawerIdeia!.id)">Ver no Brain Vault</button>
            <button class="dp-btn dp-btn-primary" @click="$emit('edit', drawerIdeia!)">Editar Ideia</button>
          </div>
        </div>
      </div>
    </div>
 
    <ConfirmModal 
      v-if="confirmDialog.show"
      :show="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :type="confirmDialog.type"
      :icon="confirmDialog.icon"
      @confirm="handleConfirmResult(true)"
      @cancel="handleConfirmResult(false)"
    />

    <NoteViewModal 
      v-if="viewingNote"
      :note="viewingNote"
      @close="viewingNote = null"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, toRef, onMounted, onUnmounted } from 'vue';
import { useIdeiaDrawer, type DrawerCallbacks } from '../composables/useIdeiaDrawer';
import type { Ideia, IdeiaStatus } from '../types/ideia';
import { useIdeias } from '../composables/useIdeias';
import RichTextEditor from './RichTextEditor.vue';
import ConfirmModal from './ConfirmModal.vue';
import NoteViewModal from './NoteViewModal.vue';
import { useTaxonomy } from '../composables/useTaxonomy';

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

const { getTipoLabel, getTipoColor, getStatusLabel, getStatusColor } = useTaxonomy();
const { updateStatus, getHistorico, updateAcesso, toggleFavorita, toggleArquivada, duplicarIdeia, deleteIdeia } = useIdeias();

const fileInputRefEl = ref<HTMLInputElement | null>(null);

const toastData = ref({ visible: false, message: '', type: 'success' });
let toastTimeout: ReturnType<typeof setTimeout> | null = null;

function localShowToast(msg: string, type: 'success' | 'error' = 'success') {
  toastData.value = { visible: true, message: msg, type };
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toastData.value.visible = false; }, 3000);
}

const drawerCallbacks: DrawerCallbacks = {
  onStatusChange: async (id: string, status: IdeiaStatus) => { await updateStatus(id, status); },
  onEdit: (ideia: Ideia) => { emit('edit', ideia); },
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
    if (res) localShowToast('Ideia excluída com sucesso!');
    else localShowToast('Erro ao excluir ideia.', 'error');
  },
  getHistorico, updateAcesso, showToast: localShowToast,
  onNavigate: (path: string) => { emit('navigate', path); },
  onCreateDerivada: (parentId: string) => { emit('createDerivada', parentId); },
};

const drawer = useIdeiaDrawer(toRef(props, 'ideias'), drawerCallbacks);
const { 
  drawerIdeia, drawerTab, docTab, notas, links, arquivos, 
  correlacoes, ecosistemaArvore, ideiasFilhas, historicoIdeia,
  statusOptions, addingNote, addingLink, editingNoteId,
  editingCorrelacaoId, uploadando, uploadProgress,
  noteEditForm, newNoteForm, newLinkForm,
  novaCorrelacaoForm, confirmDialog, viewingNote,
  abrirDrawer, fecharDrawer, mudarStatus, handleToggleFavorita,
  handleToggleArquivar, handleDuplicar, confirmarDelete,
  handleConfirmResult, startEditNote, saveEditNote, deleteNota,
  openAddNote, saveNewNote, deleteLink, saveNewLink,
  onFileSelected, openArquivo, deleteArquivo, startEditCorrelacao,
  saveEditCorrelacao, deleteCorrelacao, criarCorrelacao,
  getWorkspaceName, allTags, formatDate, fileIcon, formatBytes,
  openExternalLink, cadastrarDerivada, filtroConexao,
  correlacaoEditForm, ideiasParaConectar
} = drawer;

let mouseIsDownOnOverlay = false;
function onOverlayMouseDown() { mouseIsDownOnOverlay = true; }
function onOverlayMouseUp() {
  if (mouseIsDownOnOverlay) fecharDrawer();
  mouseIsDownOnOverlay = false;
}

function abrirIdeiaCorrelata(id: string) {
  const ideia = props.ideias.find(i => i.id === id);
  if (ideia) drawer.abrirDrawer(ideia);
}

function handleEsc(e: KeyboardEvent) {
  if (e.key === 'Escape' && drawer.drawerIdeia.value) drawer.fecharDrawer();
}

onMounted(() => { window.addEventListener('keydown', handleEsc); });
onUnmounted(() => { window.removeEventListener('keydown', handleEsc); });

defineExpose({
  abrirDrawer: drawer.abrirDrawer,
  fecharDrawer: drawer.fecharDrawer,
  drawerIdeia: drawer.drawerIdeia,
});
</script>

<style scoped>
.drawer-overlay-align { justify-content: flex-end; align-items: stretch; padding: 0; }

.dp-drawer-container {
  width: 50vw;
  min-width: 500px;
  max-width: 90vw;
  height: 100vh;
  background: var(--dp-modal-bg);
  box-shadow: -20px 0 60px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }

.drawer-header-spacing { padding: 32px 32px 24px; flex-shrink: 0; border: none; }
.drawer-header-content { display: flex; flex-direction: column; gap: 12px; width: 100%; }
.drawer-header-top { display: flex; justify-content: space-between; align-items: center; }
.drawer-header-badges { display: flex; gap: 8px; }

.drawer-actions { display: flex; gap: 8px; align-items: center; }
.drawer-action-btn {
  background: transparent; border: 1px solid var(--dp-modal-border); color: var(--dp-modal-text-secondary);
  width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}
.drawer-action-btn:hover { background: rgba(0,0,0,0.03); color: var(--dp-modal-text-primary); border-color: var(--dp-modal-text-secondary); }
.dark .drawer-action-btn:hover { background: rgba(255,255,255,0.05); }
.star-active { color: #f59e0b; }

.drawer-close-btn {
  background: var(--dp-modal-border); border: none; color: var(--dp-modal-text-secondary);
  width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; margin-left: 4px;
}
.drawer-close-btn:hover { background: #f1416c; color: white; transform: rotate(90deg); }

.drawer-main-title { font-size: 24px; line-height: 1.2; margin: 0; }

.drawer-body-padding { padding: 0 32px 32px; background: transparent; overflow-y: auto; flex: 1; }

.drawer-tab-pane { display: flex; flex-direction: column; gap: 24px; padding-top: 24px; }

.drawer-status-score-row { display: flex; justify-content: space-between; align-items: center; gap: 16px; }

.status-select-custom { position: relative; width: auto; min-width: 180px; }
.status-select-actual { opacity: 0; position: absolute; inset: 0; z-index: 2; cursor: pointer; }
.status-visual-badge {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 8px 16px; border-radius: 10px; color: white; font-size: 13px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em; transition: filter 0.2s;
}
.status-visual-badge svg { opacity: 0.8; }

.dp-score-stars { font-size: 18px; display: flex; gap: 2px; }
.star-on { color: #f59e0b; }
.star-off { color: var(--dp-modal-border); opacity: 0.5; }

.drawer-section-card {
  background: rgba(var(--dp-modal-text-primary-rgb, 0,0,0), 0.02);
  border: 1px solid var(--dp-modal-border);
  border-radius: 16px; padding: 20px;
}
.dark .drawer-section-card { background: rgba(255,255,255,0.02); }

.section-title { font-size: 12px; font-weight: 800; color: var(--dp-modal-text-secondary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
.section-subtitle { font-size: 13px; color: var(--dp-modal-text-secondary); margin-bottom: 16px; }

.eco-tree-container { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
.eco-node-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.eco-node-item:hover { background: rgba(var(--dp-modal-primary-rgb, 59,130,246), 0.05); }
.eco-node-item.is-current { background: rgba(var(--dp-modal-primary-rgb, 59,130,246), 0.08); cursor: default; }
.eco-node-arrow { color: var(--dp-modal-text-secondary); font-size: 16px; line-height: 1; }
.eco-node-bullet { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
.eco-node-content { flex: 1; min-width: 0; }
.eco-node-rel { font-size: 10px; font-weight: 800; color: var(--dp-modal-primary); text-transform: uppercase; margin-bottom: 2px; }
.eco-node-name { font-size: 14px; font-weight: 600; color: var(--dp-modal-text-primary); }
.eco-current-text { color: var(--dp-modal-primary); font-weight: 400; font-size: 12px; }
.eco-node-meta { font-size: 11px; color: var(--dp-modal-text-secondary); display: flex; gap: 6px; margin-top: 2px; }
.dot-separator { opacity: 0.5; }

.eco-actions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.drawer-content-grid { display: grid; gap: 20px; }
.content-item label { font-size: 11px; font-weight: 800; color: var(--dp-modal-text-secondary); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }
.content-item p { font-size: 15px; color: var(--dp-modal-text-primary); line-height: 1.6; margin: 0; }

.dp-tags-list { display: flex; flex-wrap: wrap; gap: 6px; }
.dp-tag-chip { background: var(--dp-modal-border); color: var(--dp-modal-text-secondary); padding: 4px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; }

.history-list-box { background: rgba(0,0,0,0.02); border-radius: 12px; padding: 12px; max-height: 200px; overflow-y: auto; border: 1px solid var(--dp-modal-border); }
.dark .history-list-box { background: rgba(255,255,255,0.02); }
.history-item-row { display: flex; flex-direction: column; padding: 8px 0; border-bottom: 1px dashed var(--dp-modal-border); }
.history-item-row:last-child { border-bottom: none; }
.history-date { font-size: 11px; color: var(--dp-modal-text-secondary); }
.history-action { font-size: 13px; color: var(--dp-modal-text-primary); }
.history-details { color: var(--dp-modal-text-secondary); font-style: italic; font-size: 12px; }

.drawer-footer-meta { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--dp-modal-text-secondary); padding-top: 16px; border-top: 1px solid var(--dp-modal-border); }

.dp-sub-tabs { display: flex; gap: 12px; border-bottom: 1px solid var(--dp-modal-border); padding-bottom: 2px; }
.sub-tab { background: transparent; border: none; padding: 8px 4px; font-size: 13px; font-weight: 600; color: var(--dp-modal-text-secondary); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
.sub-tab.active { color: var(--dp-modal-primary); border-bottom-color: var(--dp-modal-primary); }

.doc-content-area { padding-top: 20px; display: flex; flex-direction: column; gap: 16px; }
.add-doc-btn { border-style: dashed !important; border-width: 1.5px !important; width: 100%; justify-content: center; }

.notas-grid { display: flex; flex-direction: column; gap: 12px; }
.nota-card-premium { border: 1px solid var(--dp-modal-border); border-radius: 16px; background: var(--dp-modal-bg); overflow: hidden; transition: all 0.2s; }
.nota-card-premium:hover { border-color: var(--dp-modal-primary); box-shadow: 0 8px 20px rgba(0,0,0,0.05); }
.nota-card-view { display: flex; cursor: pointer; }
.nota-card-accent { width: 6px; flex-shrink: 0; }
.nota-card-main { flex: 1; padding: 16px; min-width: 0; }
.nota-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
.nota-card-title { font-size: 15px; font-weight: 700; color: var(--dp-modal-text-primary); }
.nota-card-actions { display: flex; gap: 8px; opacity: 0; transition: opacity 0.2s; }
.nota-card-premium:hover .nota-card-actions { opacity: 1; }
.nota-card-actions button { background: transparent; border: none; color: var(--dp-modal-text-secondary); cursor: pointer; transition: color 0.2s; }
.nota-card-actions button:hover { color: var(--dp-modal-primary); }
.nota-card-actions button.btn-del:hover { color: #f1416c; }
.nota-card-preview { font-size: 13px; color: var(--dp-modal-text-secondary); max-height: 80px; overflow: hidden; position: relative; }
.nota-card-preview::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 30px; background: linear-gradient(to top, var(--dp-modal-bg), transparent); }

.nota-edit-form { padding: 20px; background: rgba(0,0,0,0.01); display: flex; flex-direction: column; gap: 12px; }
.dark .nota-edit-form { background: rgba(255,255,255,0.01); }
.form-footer-flex { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 8px; }
.color-picker-mini { display: flex; gap: 8px; }
.color-picker-mini button { width: 20px; height: 20px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform 0.2s; }
.color-picker-mini button.active { border-color: var(--dp-modal-text-primary); transform: scale(1.2); }
.form-btns { display: flex; gap: 8px; }

.links-list-premium { display: flex; flex-direction: column; gap: 10px; }
.link-item-premium { display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid var(--dp-modal-border); border-radius: 16px; background: var(--dp-modal-bg); transition: all 0.2s; }
.link-item-premium:hover { border-color: var(--dp-modal-primary); transform: translateY(-2px); }
.link-icon-box { width: 40px; height: 40px; border-radius: 12px; background: rgba(var(--dp-modal-primary-rgb, 59,130,246), 0.1); color: var(--dp-modal-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.link-info-box { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.link-title-url { font-size: 15px; font-weight: 700; color: var(--dp-modal-primary); text-decoration: none; margin-bottom: 2px; }
.link-title-url:hover { text-decoration: underline; }
.link-desc { font-size: 13px; color: var(--dp-modal-text-secondary); }
.link-url-text { font-size: 11px; color: var(--dp-modal-text-secondary); opacity: 0.6; margin-top: 4px; word-break: break-all; }
.btn-link-del { background: transparent; border: none; color: var(--dp-modal-text-secondary); cursor: pointer; opacity: 0; transition: all 0.2s; }
.link-item-premium:hover .btn-link-del { opacity: 1; }
.btn-link-del:hover { color: #f1416c; }

.link-add-form-premium { display: flex; flex-direction: column; gap: 12px; padding: 20px; background: rgba(0,0,0,0.02); border-radius: 16px; border: 1px solid var(--dp-modal-border); }
.form-btns-right { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }

.files-grid-premium { display: grid; gap: 10px; }
.file-item-premium { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border: 1px solid var(--dp-modal-border); border-radius: 16px; background: var(--dp-modal-bg); }
.file-icon-premium { font-size: 24px; flex-shrink: 0; }
.file-details { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.file-name { font-size: 14px; font-weight: 600; color: var(--dp-modal-text-primary); }
.file-size { font-size: 12px; color: var(--dp-modal-text-secondary); }
.file-actions { display: flex; gap: 8px; }
.file-actions button { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--dp-modal-border); background: transparent; color: var(--dp-modal-text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.btn-file-open:hover { background: rgba(var(--dp-modal-primary-rgb, 59,130,246), 0.1); color: var(--dp-modal-primary); border-color: var(--dp-modal-primary); }
.btn-file-del:hover { background: rgba(241, 65, 108, 0.1); color: #f1416c; border-color: #f1416c; }

.upload-status-card { display: flex; flex-direction: column; gap: 8px; padding: 16px; background: rgba(var(--dp-modal-primary-rgb, 59,130,246), 0.05); border-radius: 12px; }
.upload-bar-bg { width: 100%; height: 6px; background: var(--dp-modal-border); border-radius: 10px; overflow: hidden; }
.upload-bar-fill { height: 100%; background: var(--dp-modal-primary); transition: width 0.3s; }

.connections-list-premium { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.connection-item-premium { border: 1px solid var(--dp-modal-border); border-radius: 16px; background: var(--dp-modal-bg); overflow: hidden; }
.connection-view { display: flex; align-items: center; padding: 16px; gap: 16px; }
.conn-info { flex: 1; min-width: 0; }
.conn-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.conn-name { font-size: 15px; color: var(--dp-modal-text-primary); }
.conn-meta { display: flex; align-items: center; gap: 8px; font-size: 12px; }
.conn-status { font-weight: 700; text-transform: uppercase; }
.conn-desc { color: var(--dp-modal-text-secondary); font-style: italic; }
.conn-actions { display: flex; gap: 8px; opacity: 0; transition: opacity 0.2s; }
.connection-item-premium:hover .conn-actions { opacity: 1; }
.conn-actions button { background: transparent; border: none; color: var(--dp-modal-text-secondary); cursor: pointer; transition: color 0.2s; }
.conn-actions button:hover { color: var(--dp-modal-primary); }
.conn-actions .btn-del:hover { color: #f1416c; }

.add-connection-box { display: flex; flex-direction: column; gap: 12px; padding: 20px; background: rgba(0,0,0,0.02); border-radius: 16px; border: 1px solid var(--dp-modal-border); }
.dark .add-connection-box { background: rgba(255,255,255,0.02); }
.search-input-wrapper { position: relative; }
.search-icon { position: absolute; left: 14px; top: 14px; color: var(--dp-modal-text-secondary); opacity: 0.5; }
.search-input-wrapper .dp-input { padding-left: 40px; }
.select-custom { cursor: pointer; }

.drawer-footer-btns { padding: 24px 32px; border-top: 1px solid var(--dp-modal-border); flex-shrink: 0; justify-content: space-between; }
.footer-left-group, .footer-right-group { display: flex; gap: 12px; }
.btn-danger-text:hover { color: #f1416c; border-color: #f1416c; }
</style>
