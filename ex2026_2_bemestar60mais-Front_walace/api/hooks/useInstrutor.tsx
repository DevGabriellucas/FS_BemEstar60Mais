import { useState } from "react";
import { API } from "@/api/api";
import { useAuthStore } from "@/store/authStore";

export const useInstrutor = () => {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listarAlunos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/auth/personal/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao listar alunos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const cadastrarAluno = async (novoAluno: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post("/auth/users/register/", novoAluno, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao cadastrar aluno");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const buscarAluno = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/health/anamnesis/?user_id=${alunoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao buscar aluno");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const diasTreinados = async (id: number, month: string, year: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(
        `/workouts/list/?id=${id}&month=${month}&year=${year}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || "Erro ao obter dias treinados");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const graficoEsforco = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/graphics/effort/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao obter gráfico de esforço"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const graficoSatisfacao = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/graphics/rate/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao obter gráfico de satisfação"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const graficoDuracao = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/graphics/training-time/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(
        err?.response?.data?.message || "Erro ao obter dados do instrutor"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listaGlicemia = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/graphics/glycemia/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao obter gráficos de glicemia e pressão');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listaPressao = async (userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/graphics/blood-pressure/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao obter gráficos de glicemia e pressão');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const graficosCst = async (userId: number, field_name: string | number, group: string) => {
    setLoading(true);
    setError(null);
    console.log(`graphics/health/${field_name}/${group}/${userId}/`)
    try {
      const response = await API.get(`graphics/health/${group}/${field_name}/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao obter gráficos CST');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const listarJogosCognitivos = async (id: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/health/game-session/report/?user_id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err: any) {
      console.log({ error: err });
      setError(err?.response?.data?.message || 'Erro ao listar jogos cognitivos');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    listarAlunos,
    cadastrarAluno,
    buscarAluno,
    diasTreinados,
    graficoEsforco,
    graficoSatisfacao,
    graficoDuracao,
    listaGlicemia,
    listaPressao,
    graficosCst,

    listarJogosCognitivos
  };
};
