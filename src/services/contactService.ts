import { fetchApi } from "./api";

export interface Contato {
  id: number;
  nome: string;
  status: boolean;
  idtipo: number;
  idusuario: number;
  valor: string;
}

export interface CreateContatoRequest {
  nome: string;
  idtipo: number;
  idusuario?: number;
  valor: string;
}

export const contatoService = {
  createContato: async (data: CreateContatoRequest): Promise<Contato> => {
    try {
      const response = await fetchApi<Contato>("/contato/", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getContatosAtivos: async (): Promise<Contato[]> => {
    try {
      const response = await fetchApi<Contato[]>("/contatos/ativos/", {
        method: "GET",
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getContatosInativos: async (): Promise<Contato[]> => {
    try {
      const response = await fetchApi<Contato[]>("/contatos/inaltivos/", {
        method: "GET",
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (contatoId: number, status: boolean): Promise<Contato> => {
    try {
      const response = await fetchApi<Contato>(`/contato/${contatoId}/status/`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
