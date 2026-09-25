import { useState } from "react";
import { API } from "@/api/api";
import { useAuthStore } from "@/store/authStore";

export const useAluno = () => {
  const { token, id } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registroControleSaude = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/health/health-control/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao registrar controle de saúde"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obterControleSaude = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/health/health-control/?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao obter controle de saúde');
      return null;
    } finally {
      setLoading(false);
    }
  }

  const registroAnamnese = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/health/anamnesis/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao registrar anamnese");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obterAnamnese = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/health/anamnesis/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao obter anamnese");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editarAnamnese = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/health/anamnesis/', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao editar anamnese");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registroControleHidrico = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/health/water-intake/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao registrar controle hídrico"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const obterControleHidrico = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/health/water-intake/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao obter controle hídrico"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const editarControleHidrico = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.put("/health/water-intake/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao editar controle hídrico"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registrarSessaoJogo = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post('/health/game-session/', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao registrar sessão de jogos"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listarDiasTreinados = async (month: string, year: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(
        `/workouts/list/?month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao listar dias treinados");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cadastrarDiaTreinado = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/health/daily-record/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao cadastrar dia treinado"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verificarAlunoTreinou = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/workouts/treinou/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao verificar treino do aluno"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

    const RegistroGlicemiaPressao = async (data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post(`/health/glicemia-pressao/`, data , {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao registrar a glicemia e a pressão');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const GetJogosCognitivos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/health/game-session/report/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao obter jogos cognitivos');
      return null;
    } finally {
      setLoading(false);
    }
  }

  const GetGlicemiaPressao = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/health/glicemia-pressao/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao obter glicemia e pressão');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    registroControleSaude,
    obterControleSaude,

    registroAnamnese,
    obterAnamnese,
    editarAnamnese,
    registroControleHidrico,
    obterControleHidrico,
    editarControleHidrico,
    registrarSessaoJogo,
    listarDiasTreinados,
    cadastrarDiaTreinado,
    verificarAlunoTreinou,
    RegistroGlicemiaPressao,

    GetJogosCognitivos,
    GetGlicemiaPressao
  };
};
