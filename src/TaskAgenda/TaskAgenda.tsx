import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Pagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useState, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import { dataProvider } from '../providers/supabase';
import { TaskEdit } from '../tasks/TaskEdit';
import { useUsuarioLogadoInfo } from '../hooks/useUsuarioLogado';

dayjs.locale('pt-br');

type Task = {
  id: string;
  nomeCompleto: string;
  empresa: string;
  cargo: string;
  telefone: string;
  email: string;
  historico: string;
  objetivo: string;
  contexto: string;
  recursos: string;
  acoesPosVisita: string;
  local: string;
  prioridade: string;
  due_date: string;
  responsavel: string;
};

const ITEMS_PER_PAGE = 5;

const prioridadeCores: Record<string, string> = {
  Alta: '#f44336',
  Média: '#ff9800',
  Baixa: '#4caf50',
  Normal: '#2196f3',
};

const TaskAgenda = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filtroCliente, setFiltroCliente] = useState('');
  const [paginaDoDia, setPaginaDoDia] = useState(1);
  const [taskReagendarId, setTaskReagendarId] = useState<string | null>(null);
  const usuario = useUsuarioLogadoInfo();

  const hoje = dayjs();

  useEffect(() => {
    dataProvider
      .getList('tasks', {
        pagination: { page: 1, perPage: 500 },
        sort: { field: 'due_date', order: 'ASC' },
        filter: {},
      })
      .then(res => setTasks(res.data as Task[]));
  }, []);

  const tarefasSemana = useMemo(() => {
    return tasks.filter(task => {
      const data = dayjs(task.due_date);
      const dias = data.diff(hoje, 'day');
      return dias >= 0 && dias <= 7;
    });
  }, [tasks]);

  const tarefasPorDia = useMemo(() => {
    return tarefasSemana.reduce((acc: Record<string, Task[]>, task) => {
      const dia = dayjs(task.due_date).format('dddd');
      acc[dia] = acc[dia] ? [...acc[dia], task] : [task];
      return acc;
    }, {});
  }, [tarefasSemana]);

  const tarefasDoDia = useMemo(() => {
    const lista = tarefasPorDia[selectedDay ?? ''] ?? [];
    return lista.filter(task =>
      task.nomeCompleto?.toLowerCase().includes(filtroCliente.toLowerCase()) &&
      (!selectedDate || dayjs(task.due_date).isSame(selectedDate, 'day'))
    );
  }, [tarefasPorDia, selectedDay, filtroCliente, selectedDate]);

  const tarefasPaginadas = tarefasDoDia.slice(
    (paginaDoDia - 1) * ITEMS_PER_PAGE,
    paginaDoDia * ITEMS_PER_PAGE
  );

  const handleCancelar = (task: Task) => {
    alert(`Cancelar tarefa de ${task.nomeCompleto}`);
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>📆 Agenda Semanal</Typography>

      {usuario && (
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          {usuario.avatar && <Avatar src={usuario.avatar} />}
          <Typography variant="subtitle1">
            Logado como: <strong>{usuario.fullName}</strong>
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        {Object.entries(tarefasPorDia).map(([dia, lista]) => (
          <Grid item xs={12} sm={6} md={4} key={dia}>
            <Card onClick={() => {
              setSelectedDay(dia);
              setPaginaDoDia(1);
              setSelectedDate(null);
              setFiltroCliente('');
            }} sx={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6">{dia}</Typography>
                <Typography variant="body2">{lista.length} compromissos</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedDay && (
        <Box mt={4}>
          <Typography variant="h6">📌 Compromissos de {selectedDay}</Typography>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <TextField
                label="Filtrar por cliente"
                value={filtroCliente}
                onChange={(e) => {
                  setFiltroCliente(e.target.value);
                  setPaginaDoDia(1);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="Filtrar por data específica"
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setPaginaDoDia(1);
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
          </Grid>

          {tarefasPaginadas.map((task) => (
            <Card key={task.id} sx={{
              mb: 2,
              borderLeft: `6px solid ${prioridadeCores[task.prioridade] ?? '#2196f3'}`,
              boxShadow: 2,
            }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">👤 Cliente: {task.nomeCompleto}</Typography>
                <Typography variant="body2">🧑‍💼 Responsável: {task.responsavel}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  🕒 {dayjs(task.due_date).format('HH:mm')} | 🎯 {task.objetivo}
                </Typography>
                <Box mt={2} display="flex" gap={1}>
                  <Button variant="outlined" color="primary" onClick={() => setTaskReagendarId(task.id)}>Reagendar</Button>
                  <Button variant="outlined" color="error" onClick={() => handleCancelar(task)}>Cancelar</Button>
                  <Button variant="outlined" onClick={() => setSelectedTask(task)}>Ver detalhes</Button>
                </Box>
              </CardContent>
            </Card>
          ))}

          <Pagination
            count={Math.ceil(tarefasDoDia.length / ITEMS_PER_PAGE)}
            page={paginaDoDia}
            onChange={(e, value) => setPaginaDoDia(value)}
            sx={{ mt: 2 }}
          />
        </Box>
      )}

      {taskReagendarId && usuario?.id && (
        <TaskEdit
          open={!!taskReagendarId}
          close={() => setTaskReagendarId(null)}
          taskId={taskReagendarId}
          onSaved={() => {
            setTaskReagendarId(null);
            setSelectedTask(null);
            setPaginaDoDia(1);
          }}
        />
      )}

      <Dialog open={!!selectedTask} onClose={() => setSelectedTask(null)} fullWidth maxWidth="md">
        <DialogTitle>🔍 Detalhes do Compromisso</DialogTitle>
        <DialogContent dividers>
          {selectedTask && (
            <Box display="grid" gap={1}>
              <Typography><strong>Cliente:</strong> {selectedTask.nomeCompleto}</Typography>
              <Typography><strong>Empresa:</strong> {selectedTask.empresa}</Typography>
              <Typography><strong>Cargo:</strong> {selectedTask.cargo}</Typography>
              <Typography><strong>Contato:</strong> {selectedTask.telefone} / {selectedTask.email}</Typography>
              <Typography><strong>Histórico:</strong> {selectedTask.historico}</Typography>
              <Typography><strong>Objetivo:</strong> {selectedTask.objetivo}</Typography>
              <Typography><strong>Contexto:</strong> {selectedTask.contexto}</Typography>
              <Typography><strong>Recursos:</strong> {selectedTask.recursos}</Typography>
              <Typography><strong>Ações Pós-Visita:</strong> {selectedTask.acoesPosVisita}</Typography>
              <Typography><strong>Local:</strong> {selectedTask.local}</Typography>
                            <Typography>
                <strong>Prioridade:</strong> {selectedTask.prioridade}
              </Typography>
              <Typography>
                <strong>Data:</strong> {dayjs(selectedTask.due_date).format('dddd, DD/MM/YYYY HH:mm')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTask(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskAgenda;

