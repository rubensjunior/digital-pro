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
  created_at: string;
  updated_at: string;
}

// Payload para criação (sem campos gerados automaticamente)
export type CreateIdeiaPayload = Omit<Ideia, 'id' | 'created_at' | 'updated_at'>;

// Payload para atualização (todos opcionais exceto id)
export type UpdateIdeiaPayload = Partial<Omit<Ideia, 'id' | 'created_at'>> & { id: string };

// ─── Raw row do SQLite (tags como JSON string) ────────────────────────────────
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
  };
}

function safeParseJSON(value: string): string[] {
  try {
    return JSON.parse(value) ?? [];
  } catch {
    return [];
  }
}
