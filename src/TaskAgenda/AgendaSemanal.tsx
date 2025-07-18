import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { dataProvider } from '../providers/supabase';
import NovaTarefaModal from '../NovaTarefaModal/NovaTarefaModal';

type Tarefa = {
  id: string;
  task_type: string;
  contact_name: string;
  assigned_to_name: string;
  due_date: string;
  status: string;
  lead_id?: string;
};

const AgendaSemanal = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [tarefasPorDia, setTarefasPorDia] = useState<Record<string, Tarefa[]>>({});
  const [loading, setLoading] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const fetchTarefas = async () => {
    setLoading(true);
    try {
      const res = await dataProvider.getList('tasks', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'due_date', order: 'ASC' },
        filter: {},
      });

      setTarefas(res.data);

      const agrupado: Record<string, Tarefa[]> = {};
      res.data.forEach((tarefa) => {
        const dia = tarefa.due_date.slice(0, 10);
        if (!agrupado[dia]) agrupado[dia] = [];
        agrupado[dia].push(tarefa);
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
      await dataProvider.update('tasks', {
        id,
        data: { status: 'Concluído' },
        previousData: {},
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

      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => setModalAberto(true)}
      >
        ➕ Nova Tarefa
      </Button>

      {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}

      {!loading && Object.entries(tarefasPorDia).length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Nenhuma tarefa agendada no momento.
        </Typography>
      )}

      {!loading &&
        Object.entries(tarefasPorDia).map(([dia, tarefasDia]) => (
          <Box key={dia} mb={3}>
            <Typography variant="h6">
              {new Date(dia).toLocaleDateString('pt-BR')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {tarefasDia.map((tarefa) => (
                <Card key={tarefa.id}>
                  <CardContent>
                    <Typography variant="subtitle1">
                      {tarefa.contact_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {tarefa.task_type} •{' '}
                      {new Date(tarefa.due_date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      <br />
                      Responsável: {tarefa.assigned_to_name}
                    </Typography>

                    <Stack direction="row" spacing={1} mt={1}>
                      <Chip
                        label={tarefa.status}
                        color={
                          tarefa.status === 'Concluído'
                            ? 'success'
                            : tarefa.status === 'Pendente'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />

                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => concluirTarefa(tarefa.id)}
                        disabled={
                          tarefa.status === 'Concluído' ||
                          atualizandoId === tarefa.id
                        }
                      >
                        {atualizandoId === tarefa.id
                          ? 'Atualizando...'
                          : '✅ Concluir'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        ))}

      {/* Modal de criação de nova tarefa */}
      {modalAberto && (
        <NovaTarefaModal
          open={modalAberto}
          close={() => setModalAberto(false)}
          onSaved={fetchTarefas}
        />
      )}
    </Box>
  );
};

export default AgendaSemanal;
