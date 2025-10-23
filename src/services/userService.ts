import { fetchApi } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cpf?: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
}

export interface UpdateStatusRequest {
  ativo: boolean;
}

export const userService = {
// POST /usuario/
  createUsuario: async (data: CreateUsuarioRequest): Promise<Usuario> => {
    try {
      const response = await fetchApi<Usuario>('/usuario/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },


// GET /usuarios/ativos
  getUsuariosAtivos: async (): Promise<Usuario[]> => {
    try {
      const response = await fetchApi<Usuario[]>('/usuarios/ativos', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },


// GET /usuarios/inativos
  getUsuariosInativos: async (): Promise<Usuario[]> => {
    try {
      const response = await fetchApi<Usuario[]>('/usuarios/inativos', {
        method: 'GET',
      });
      return response;
    } catch (error) {
      throw error;
    }
  },


// PUT /usuario/{user_id}/status/
  updateStatus: async (userId: number, ativo: boolean): Promise<Usuario> => {
    try {
      const response = await fetchApi<Usuario>(`/usuario/${userId}/status/`, {
        method: 'PUT',
        body: JSON.stringify({ ativo }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },


// Ativar usuário (atalho)
  ativarUsuario: async (userId: number): Promise<Usuario> => {
    return userService.updateStatus(userId, true);
  },


// Desativar usuário (atalho)
  desativarUsuario: async (userId: number): Promise<Usuario> => {
    return userService.updateStatus(userId, false);
  },
};