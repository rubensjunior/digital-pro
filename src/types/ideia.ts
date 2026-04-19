// ─── Tipos de Ideia ──────────────────────────────────────────────────────────

export type IdeiaStatus = 
  // Fluxo Geral
  | 'bruta' 
  | 'pesquisa' 
  | 'validada' 
  | 'nao_validada' 
  | 'escalada' 
  | 'arquivada'
  // Desenvolvimento
  | 'backlog' 
  | 'em_desenvolvimento' 
  | 'em_teste' 
  | 'implementado' 
  | 'pausado'
  // Produção
  | 'rascunho' 
  | 'em_revisao' 
  | 'aprovado' 
  | 'publicado'
  // Jurídico
  | 'pendente' 
  | 'em_analise' 
  | 'assinado_deferido' 
  | 'cancelado_indeferido';

export const STATUS_AGRUPADOS: { label: string; options: { value: IdeiaStatus; label: string }[] }[] = [
  {
    label: '🧠 Fluxo de Ideia (Geral)',
    options: [
      { value: 'bruta', label: 'Bruta (Capturada)' },
      { value: 'pesquisa', label: 'Em Pesquisa / Estudo' },
      { value: 'validada', label: 'Validada (Pronta)' },
      { value: 'nao_validada', label: 'Não Validada / Descartada' },
      { value: 'escalada', label: 'Escalada (Em Escala)' },
      { value: 'arquivada', label: 'Arquivada' }
    ]
  },
  {
    label: '💻 Desenvolvimento & Projetos',
    options: [
      { value: 'backlog', label: 'Backlog' },
      { value: 'em_desenvolvimento', label: 'Em Desenvolvimento' },
      { value: 'em_teste', label: 'Em Teste (QA)' },
      { value: 'implementado', label: 'Implementado / Em Produção' },
      { value: 'pausado', label: 'Pausado / Bloqueado' }
    ]
  },
  {
    label: '📝 Produção & Conteúdo',
    options: [
      { value: 'rascunho', label: 'Rascunho / Draft' },
      { value: 'em_revisao', label: 'Em Revisão' },
      { value: 'aprovado', label: 'Aprovado / Pronto' },
      { value: 'publicado', label: 'Publicado / Finalizado' }
    ]
  },
  {
    label: '⚖️ Jurídico & Administrativo',
    options: [
      { value: 'pendente', label: 'Pendente' },
      { value: 'em_analise', label: 'Em Análise' },
      { value: 'assinado_deferido', label: 'Assinado / Deferido' },
      { value: 'cancelado_indeferido', label: 'Cancelado / Indeferido' }
    ]
  }
];

export function getStatusLabel(status: IdeiaStatus): string {
  for (const grupo of STATUS_AGRUPADOS) {
    const opt = grupo.options.find(o => o.value === status);
    if (opt) return opt.label.split(' (')[0]; // Remove details like "(Capturada)" if present for simplicity
  }
  return status;
}

export function getStatusGroupsForTipo(tipo?: IdeiaTipo) {
  if (!tipo) {
    return STATUS_AGRUPADOS.filter(g => g.label.includes('Geral'));
  }

  const grupoTipo = TIPOS_AGRUPADOS.find(g => g.options.includes(tipo))?.label || '';
  
  const gruposParaMostrar = ['Geral'];

  if (grupoTipo.includes('Programação') || grupoTipo.includes('SaaS') || grupoTipo.includes('Gestão')) {
    gruposParaMostrar.push('Desenvolvimento');
  } else if (grupoTipo.includes('Marketing') || grupoTipo.includes('Publicidade')) {
    gruposParaMostrar.push('Produção');
  } else if (grupoTipo.includes('Jurídico') || grupoTipo.includes('Administrativo')) {
    gruposParaMostrar.push('Jurídico');
  }

  return STATUS_AGRUPADOS.filter(g => gruposParaMostrar.some(keyword => g.label.includes(keyword)));
}

export type IdeiaTipo =
  // Marketing & Copywriting
  | 'Produto'
  | 'Promessa'
  | 'Ângulo de Venda'
  | 'Headline'
  | 'Hook (Gancho)'
  | 'Big Idea'
  | 'VSL (Vídeo de Vendas)'
  | 'Funil de Vendas'
  | 'Lançamento'
  | 'Copywriting'
  | 'Criativo (Anúncio)'
  | 'Lead Magnet (Isca)'
  | 'E-mail Marketing'
  // Publicidade & Social Media
  | 'Campanha Publicitária'
  | 'Roteiro'
  | 'Storyboard'
  | 'Briefing'
  | 'Mídia Kit'
  | 'Planejamento de Mídia'
  | 'Post Social Media'
  | 'Newsletter'
  // Programação & Tecnologia
  | 'POC (Proof of Concept)'
  | 'Nova Feature'
  | 'Bugfix (Correção)'
  | 'Refatoração'
  | 'Arquitetura de Software'
  | 'API / Integração'
  | 'Interface (UI/UX)'
  | 'Automação / Script'
  | 'Banco de Dados'
  | 'DevOps / Infraestrutura'
  // Gestão & Projetos
  | 'Planejamento Estratégico'
  | 'Sprint / Roadmap'
  | 'Tarefa (Task)'
  | 'Processo / Workflow'
  | 'Insight de Negócio'
  | 'KPI / Métrica'
  | 'OKR (Objetivos)'
  // SaaS & Produto
  | 'Onboarding de Usuário'
  | 'Retenção / Churn'
  | 'Pricing / Monetização'
  | 'User Experience (UX)'
  | 'MVP (Minimum Viable Product)'
  | 'Feature Request'
  // Jurídico & Documentação
  | 'Peça Processual'
  | 'Contrato'
  | 'Parecer Técnico'
  | 'Petição'
  | 'Documento / Anexo'
  | 'Planilha de Dados'
  // Administrativo & Financeiro
  | 'Nota Fiscal / Recibo'
  | 'Orçamento / Proposta'
  | 'Relatório Financeiro'
  | 'Ata de Reunião'
  | 'Protocolo / Cadastro'
  | 'Gestão de Custos'
  // Estudos & Pesquisa
  | 'Revisão de Conteúdo'
  | 'Resumo / Nota de Estudo'
  | 'Teoria / Conceito'
  | 'Método / Framework'
  | 'Citação / Referência'
  | 'Insight de Leitura'
  | 'Curso / Treinamento'
  // Outros
  | 'Insight / Ideia Solta'
  | 'Pessoal / Meta'
  | 'Outro';

export const TIPOS_AGRUPADOS: { label: string; options: IdeiaTipo[] }[] = [
  {
    label: '📣 Marketing & Copywriting',
    options: [
      'Produto', 'Promessa', 'Ângulo de Venda', 'Headline', 'Hook (Gancho)', 'Big Idea', 
      'VSL (Vídeo de Vendas)', 'Funil de Vendas', 'Lançamento', 'Copywriting', 
      'Criativo (Anúncio)', 'Lead Magnet (Isca)', 'E-mail Marketing'
    ]
  },
  {
    label: '📺 Publicidade & Social Media',
    options: [
      'Campanha Publicitária', 'Roteiro', 'Storyboard', 'Briefing', 'Mídia Kit', 
      'Planejamento de Mídia', 'Post Social Media', 'Newsletter'
    ]
  },
  {
    label: '💻 Programação & Tecnologia',
    options: [
      'POC (Proof of Concept)', 'Nova Feature', 'Bugfix (Correção)', 'Refatoração', 
      'Arquitetura de Software', 'API / Integração', 'Interface (UI/UX)', 
      'Automação / Script', 'Banco de Dados', 'DevOps / Infraestrutura'
    ]
  },
  {
    label: '📊 Gestão & Projetos',
    options: [
      'Planejamento Estratégico', 'Sprint / Roadmap', 'Tarefa (Task)', 
      'Processo / Workflow', 'Insight de Negócio', 'KPI / Métrica', 'OKR (Objetivos)'
    ]
  },
  {
    label: '🚀 SaaS & Produto',
    options: [
      'Onboarding de Usuário', 'Retenção / Churn', 'Pricing / Monetização', 
      'User Experience (UX)', 'MVP (Minimum Viable Product)', 'Feature Request'
    ]
  },
  {
    label: '⚖️ Jurídico & Documentação',
    options: [
      'Peça Processual', 'Contrato', 'Parecer Técnico', 'Petição', 
      'Documento / Anexo', 'Planilha de Dados'
    ]
  },
  {
    label: '🏢 Administrativo & Financeiro',
    options: [
      'Nota Fiscal / Recibo', 'Orçamento / Proposta', 'Relatório Financeiro', 
      'Ata de Reunião', 'Protocolo / Cadastro', 'Gestão de Custos'
    ]
  },
  {
    label: '📚 Estudos & Pesquisa',
    options: [
      'Revisão de Conteúdo', 'Resumo / Nota de Estudo', 'Teoria / Conceito', 
      'Método / Framework', 'Citação / Referência', 'Insight de Leitura', 'Curso / Treinamento'
    ]
  },
  {
    label: '🖋️ Outros',
    options: ['Insight / Ideia Solta', 'Pessoal / Meta', 'Outro']
  }
];

export type IdeiaRelationshipType = 
  | 'Complementa' 
  | 'Feature de' 
  | 'Upsell de' 
  | 'Downsell de' 
  | 'Order bump de' 
  | 'Extensão de' 
  | 'Versão de' 
  | 'Subproduto de' 
  | 'Outro';

export interface Ideia {
  id: string;
  nome: string;
  tipo: IdeiaTipo;
  status: IdeiaStatus;
  score: number; // 1 a 4 (estrelas)
  descricao?: string;
  contexto?: string;
  problema?: string;
  transformacao?: string;
  publico_alvo?: string;
  tags_avatar: string[];
  tags_nicho: string[];
  tags_dor: string[];
  tags_desejo: string[];
  tags_mecanismo: string[];
  is_arquivada: boolean;
  is_favorita: boolean;
  parent_id?: string | null;
  relationship_type?: IdeiaRelationshipType | string | null;
  last_accessed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IdeiaHistorico {
  id: string;
  ideia_id: string;
  acao: string;
  detalhes?: string;
  created_at: string;
}

// Payload para criação (sem campos gerados automaticamente)
export type CreateIdeiaPayload = Omit<Ideia, 'id' | 'created_at' | 'updated_at' | 'last_accessed_at' | 'is_arquivada' | 'is_favorita'> & {
  is_arquivada?: boolean;
  is_favorita?: boolean;
};

// Payload para atualização (todos opcionais exceto id)
export type UpdateIdeiaPayload = Partial<Omit<Ideia, 'id' | 'created_at'>> & { id: string };

// ─── Raw row do SQLite (tags como JSON string e boolean como integer) ─────────
export interface IdeiaRaw {
  id: string;
  nome: string;
  tipo: string;
  status: string;
  score: number;
  descricao: string | null;
  contexto: string | null;
  problema: string | null;
  transformacao: string | null;
  publico_alvo: string | null;
  tags_avatar: string;
  tags_nicho: string;
  tags_dor: string;
  tags_desejo: string;
  tags_mecanismo: string;
  is_arquivada: number;
  is_favorita: number;
  parent_id: string | null;
  relationship_type: string | null;
  last_accessed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Converte row do SQLite (tags como string JSON) para Ideia tipada
export function parseIdeia(raw: IdeiaRaw): Ideia {
  return {
    ...raw,
    tipo: raw.tipo as IdeiaTipo,
    status: raw.status as IdeiaStatus,
    descricao: raw.descricao ?? undefined,
    contexto: raw.contexto ?? undefined,
    problema: raw.problema ?? undefined,
    transformacao: raw.transformacao ?? undefined,
    publico_alvo: raw.publico_alvo ?? undefined,
    tags_avatar: safeParseJSON(raw.tags_avatar),
    tags_nicho: safeParseJSON(raw.tags_nicho),
    tags_dor: safeParseJSON(raw.tags_dor),
    tags_desejo: safeParseJSON(raw.tags_desejo),
    tags_mecanismo: safeParseJSON(raw.tags_mecanismo),
    is_arquivada: Boolean(raw.is_arquivada),
    is_favorita: Boolean(raw.is_favorita),
    parent_id: raw.parent_id || null,
    relationship_type: raw.relationship_type || null,
    last_accessed_at: raw.last_accessed_at ?? undefined,
  };
}

function safeParseJSON(value: string): string[] {
  try {
    return JSON.parse(value) ?? [];
  } catch {
    return [];
  }
}

// ─── Documentação Complementar ───────────────────────────────────────────────

export interface IdeiaNote {
  id: string;
  ideia_id: string;
  titulo?: string;
  conteudo: string;
  cor: string;
  created_at: string;
  updated_at: string;
}

export interface IdeiaLink {
  id: string;
  ideia_id: string;
  url: string;
  titulo?: string;
  descricao?: string;
  created_at: string;
}

export interface IdeiaArquivo {
  id: string;
  ideia_id: string;
  nome_original: string;
  caminho: string;
  tipo_mime?: string;
  tamanho?: number;
  created_at: string;
}

export interface IdeiaCorrelacao {
  id: string;
  ideia_a_id: string;
  ideia_b_id: string;
  descricao?: string;
  created_at: string;
  // Campos virtuais (JOIN)
  correlata_id?: string;
  correlata_nome?: string;
  correlata_tipo?: string;
  correlata_status?: string;
}
