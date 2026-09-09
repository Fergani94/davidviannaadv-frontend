import api from './api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    nome: string;
  };
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { email, password });
  const { token } = response.data;

  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }

  return response.data;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
