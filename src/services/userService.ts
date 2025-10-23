import { fetchApi } from './api';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  status: boolean;
}

export interface CreateUsuarioRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface UpdateStatusRequest {
  status: boolean;
}

export const userService = {
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

  updateStatus: async (userId: number, status: boolean): Promise<Usuario> => {
    try {
      const response = await fetchApi<Usuario>(`/usuario/${userId}/status/`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  ativarUsuario: async (userId: number): Promise<Usuario> => {
    return userService.updateStatus(userId, true);
  },

  desativarUsuario: async (userId: number): Promise<Usuario> => {
    return userService.updateStatus(userId, false);
  },
};
