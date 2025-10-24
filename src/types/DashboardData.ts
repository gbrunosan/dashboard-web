export interface Relatorio {
  titulo: string;
  gerado_em: string;
  periodo: {
    de: string;
    ate: string;
    granularidade: string;
  };
}

export interface TotaisContatos {
  total: number;
  ativos: number;
  inativos: number;
  novos_no_periodo: number;
  delta_vs_periodo_anterior: {
    absoluto: number;
    percentual: number;
  };
}

export interface TotaisTipos {
  total: number;
  ativos: number;
  inativos: number;
}

export interface QuebraContatosPorStatus {
  status: string;
  quantidade: number;
}

export interface QuebraContatosPorTipo {
  id_tipo: number;
  titulo_tipo: string;
  total: number;
  ativos: number;
  inativos: number;
}

export interface QuebraTiposPorStatus {
  status: string;
  quantidade: number;
}

export interface SeriePontoTotal {
  mes: string;
  valor: number;
  novos: number;
  delta: number | null;
}

export interface SeriePontoAtivosInativos {
  mes: string;
  valor: number;
}

export interface SeriesTemporais {
  metrica: string;
  unidade: string;
  observacoes: string;
  series: Serie[];
}

export interface Serie {
  chave: string;
  rotulo: string;
  pontos: SeriePontoTotal[] | SeriePontoAtivosInativos[];
}

export interface TopTiposPorCrescimento {
  id_tipo: number;
  titulo_tipo: string;
  crescimento_no_periodo: number;
}

export interface DashboardData {
  relatorio: Relatorio;
  totais: {
    contatos: TotaisContatos;
    tipos: TotaisTipos;
  };
  quebras: {
    contatos_por_status: QuebraContatosPorStatus[];
    contatos_por_tipo: QuebraContatosPorTipo[];
    tipos_por_status: QuebraTiposPorStatus[];
  };
  series_temporais: SeriesTemporais;
  top: {
    tipos_por_crescimento: TopTiposPorCrescimento[];
  };
}
