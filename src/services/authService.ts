import { fetchApi } from './api';

export interface LoginRequest {
  username: string;
  password: string;
  grant_type?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetchApi<LoginResponse>('/token/', {
        method: 'POST',
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          grant_type: 'password',
        }),
        formData: true,
      });
      
      if (response.access_token) {
        sessionStorage.setItem('token', response.access_token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    sessionStorage.removeItem('token');
  },
};