import { fetchApi } from "./api";

export interface Tipo {
  id: number;
  descricao: string;
  status: boolean;
}

export interface CreateTipoRequest {
  descricao: string;
}

export const tipoService = {
  createTipo: async (data: CreateTipoRequest): Promise<Tipo> => {
    try {
      const response = await fetchApi<Tipo>("/tipo/", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTiposAtivos: async (): Promise<Tipo[]> => {
    try {
      const response = await fetchApi<Tipo[]>("/tipos/ativos/", {
        method: "GET",
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getTiposInativos: async (): Promise<Tipo[]> => {
    try {
      const response = await fetchApi<Tipo[]>("/tipos/inativos/", {
        method: "GET",
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateStatus: async (tipoId: number, status: boolean): Promise<Tipo> => {
    try {
      const response = await fetchApi<Tipo>(`/tipo/${tipoId}/status/`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
