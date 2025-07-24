import {
  Box, Typography, Card, CardContent, Chip, Stack,
  Divider, Button, CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import { dataProvider } from '../providers/supabase';
import NovaTarefaModal from '../NovaTarefaModal/NovaTarefaModal';
import KanbanBoard from '../KanbanBoard/KanbanBoard';

interface Tarefa {
  id: string | number;
  task_type: string;
  contact_name: string;
  assigned_to_name: string;
  due_date: string;
  status: string;
  lead_id?: string;
}

const AgendaSemanal = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefasPorDia, setTarefasPorDia] = useState<Record<string, Tarefa[]>>({});
  const [loading, setLoading] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);
  const [criarAberto, setCriarAberto] = useState(false);

  const fetchTarefas = async () => {
    setLoading(true);
    try {
      const res = await dataProvider.getList('tasks', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'due_date', order: 'ASC' },
        filter: {},
      });

      const tarefasFormatadas: Tarefa[] = res.data.map(t => ({
        ...t,
        id: String(t.id), // evita erro de tipo com dnd-kit
      }));

      setTarefas(tarefasFormatadas);

      const agrupado: Record<string, Tarefa[]> = {};
      tarefasFormatadas.forEach(t => {
        const dia = t.due_date.slice(0, 10);
        if (!agrupado[dia]) agrupado[dia] = [];
        agrupado[dia].push(t);
      });

      setTarefasPorDia(agrupado);
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err);
    } finally {
      setLoading(false);
    }
  };

  const concluirTarefa = async (id: string) => {
    setAtualizandoId(id);
    try {
      const tarefaAtual = tarefas.find(t => String(t.id) === String(id));
      if (!tarefaAtual) return;

      await dataProvider.update('tasks', {
        id,
        data: { status: 'Concluído' },
        previousData: tarefaAtual,
      });

      await fetchTarefas();
    } catch (err) {
      console.error('Erro ao concluir tarefa:', err);
    } finally {
      setAtualizandoId(null);
    }
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  return (
    <Box mt={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📅 Agenda Semanal de Leads
      </Typography>

      <Button variant="contained" sx={{ mb: 3 }} onClick={() => setCriarAberto(true)}>
        ➕ Nova Tarefa
      </Button>

      {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}

      {!loading && Object.entries(tarefasPorDia).length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhuma tarefa agendada no momento.
        </Typography>
      )}

     

      <NovaTarefaModal
        open={criarAberto}
        onClose={() => setCriarAberto(false)}
        onCreated={fetchTarefas}
        dataSugestao={null}
      />

      <Box mt={5}>
         <KanbanBoard />
      </Box>
    </Box>
  );
};

export default AgendaSemanal;

