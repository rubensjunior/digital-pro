// ─── Tipos de Ideia ──────────────────────────────────────────────────────────

export type IdeiaStatus = 'bruta' | 'em_teste' | 'validada' | 'nao_validada' | 'escalada';

export type IdeiaTipo =
  | 'Produto'
  | 'Promessa'
  | 'Ângulo'
  | 'Headline'
  | 'Hook'
  | 'Big Idea'
  | 'VSL'
  | 'Funil'
  | 'Lançamento'
  | 'Outro';

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
