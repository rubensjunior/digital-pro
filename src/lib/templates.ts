export const TEMPLATES = [
  {
    id: 'marketing',
    name: 'Marketing & Infoprodutos',
    description: 'Inclui exemplo real de Lançamento Interno. Estruturas completas para funis, copy, tráfego e conteúdo.',
    color: '#f59e0b',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>',
    tags: ['Exemplo Real', 'Lançamentos', 'Funis', 'Copywriting', 'Tráfego'],
    relacionamentos: [
      { label: 'Upsell de', color: '#f59e0b' },
      { label: 'Downsell de', color: '#ef4444' },
      { label: 'Order bump de', color: '#10b981' },
      { label: 'Isca de', color: '#3b82f6' },
      { label: 'Página de', color: '#6366f1' },
      { label: 'Anúncio de', color: '#8b5cf6' },
      { label: 'E-mail de', color: '#ec4899' },
      { label: 'Outro', color: '#64748b' }
    ]
  },
  {
    id: 'software',
    name: 'Software & SaaS',
    description: 'Gestão completa de backlog, ciclos de sprint e controle de bugs para times de produto.',
    color: '#6366f1',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
    tags: ['Desenvolvimento', 'Agile', 'Product'],
    relacionamentos: [
      { label: 'Bloqueia', color: '#ef4444' },
      { label: 'Parte de', color: '#3b82f6' },
      { label: 'Implementa', color: '#10b981' },
      { label: 'Fix de', color: '#f59e0b' },
      { label: 'Depende de', color: '#8b5cf6' },
      { label: 'Relacionado', color: '#64748b' }
    ]
  },
  {
    id: 'business',
    name: 'Negócios & Gestão',
    description: 'Estruturação de metas OKR, monitoramento de KPIs corporativos e workflows operacionais.',
    color: '#10b981',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
    tags: ['OKR', 'KPIs', 'Planejamento'],
    relacionamentos: [
      { label: 'Alinhado com', color: '#10b981' },
      { label: 'Monitora', color: '#0ea5e9' },
      { label: 'Influencia', color: '#f59e0b' },
      { label: 'Suporta', color: '#8b5cf6' },
      { label: 'Responsável por', color: '#3b82f6' },
      { label: 'Outro', color: '#64748b' }
    ]
  },
  {
    id: 'education',
    name: 'Estudos & Pesquisa',
    description: 'Organização densa de conhecimento, resumos estruturados e metodologias de pesquisa.',
    color: '#ec4899',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>',
    tags: ['Académico', 'Insights', 'Teoria'],
    relacionamentos: [
      { label: 'Cita / Referencia', color: '#ec4899' },
      { label: 'Resumo de', color: '#3b82f6' },
      { label: 'Aprofunda', color: '#8b5cf6' },
      { label: 'Contradiz', color: '#ef4444' },
      { label: 'Corrobora', color: '#10b981' },
      { label: 'Prática de', color: '#f59e0b' },
    ]
  },
  {
    id: 'lowticket_funnel',
    name: 'Funil Low-Ticket (Alta Escala)',
    description: 'Estrutura avançada de 5 camadas para funis de baixo custo focados em escalar volume de clientes pagantes com alta conversão em Upsells e Downsells.',
    color: '#8b5cf6',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    tags: ['Low-Ticket', 'Order Bump', 'Upsell/Downsell', 'Aquisição', 'Alta Escala'],
    relacionamentos: [
      { label: 'Upsell de', color: '#f59e0b' },
      { label: 'Downsell de', color: '#ef4444' },
      { label: 'Order bump de', color: '#10b981' },
      { label: 'Tráfego para', color: '#3b82f6' },
      { label: 'Página de', color: '#6366f1' },
      { label: 'Página de', color: '#6366f1' },
      { label: 'E-mail de', color: '#ec4899' },
      { label: 'Outro', color: '#64748b' }
    ]
  },
  {
    id: 'ecommerce_setup',
    name: 'Implantação de E-commerce',
    description: 'Roadmap de ponta a ponta: do Planejamento e Escolha de Plataforma até a Configuração, Catálogo, ERP e Go-to-Market.',
    color: '#14b8a6',
    icon: '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>',
    tags: ['E-commerce', 'Roadmap', 'Plataforma', 'Logística', 'Catálogo'],
    relacionamentos: [
      { label: 'Bloqueia', color: '#ef4444' },
      { label: 'Pré-requisito de', color: '#f59e0b' },
      { label: 'Integrado com', color: '#10b981' },
      { label: 'Aprovado por', color: '#3b82f6' },
      { label: 'Depende de', color: '#8b5cf6' },
      { label: 'Relacionado', color: '#64748b' }
    ]
  }
];

