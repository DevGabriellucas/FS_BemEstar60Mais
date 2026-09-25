import { useState } from 'react';
import { API } from '@/api/api';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // login retorna token ou dados do usuário
  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/login/', credentials);
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao fazer login');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // registrar novo usuário personal
  const registrarPersonal = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/personal/register/', data);
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao registrar personal');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // mudar senha (primeiro acesso)
  // Requer token para autorização? Se sim, deve passar no header (aqui deixei sem)
  const mudarSenha = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      console.log("token do usuario", token)
      const response = await API.post('/auth/change-password/', data, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao mudar senha');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // resetar senha
  const resetarSenha = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/password-reset/', data);
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao resetar senha');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetarSenhaConfirm = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/auth/password-reset-confirm/', data);
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao resetar senha');
      return null;
    } finally {
      setLoading(false);
    }
  }

    const obterDadosUsuario = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get('/auth/user-update/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (err: any) {
        console.log({ error: err });
        setError(err?.response?.data?.message || 'Erro ao obter dados do usuário');
        return null;
      } finally {
        setLoading(false);
      }
    };

    const editarDados = async (data: object) => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.put('/auth/user-update/', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (err: any) {
        console.log({ error: err });
        setError(err?.response?.data?.message || 'Erro ao editar dados do usuário');
        return null;
      } finally {
        setLoading(false);
      }
    };
  

  return {
    loading,
    error,
    login,
    registrarPersonal,
    mudarSenha,
    resetarSenha,
    resetarSenhaConfirm,
    obterDadosUsuario,
    editarDados
  };
};