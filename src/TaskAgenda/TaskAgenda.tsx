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
  nomecompleto: string;
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

  // useEffect(() => {
  //   dataProvider
  //     .getList('tasks', {
  //       pagination: { page: 1, perPage: 500 },
  //       sort: { field: 'due_date', order: 'ASC' },
  //       filter: {},
  //     })
  //     .then(res => setTasks(res.data as Task[]));
  // }, []);

  useEffect(() => {
    dataProvider.getList('tasks', {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'due_date', order: 'ASC' },
      filter: {},
    }).then(res => {
      console.log('Dados de tarefas recebidos:', res.data[0]?.due_date);
      const dadosCompletos: Task[] = res.data.map((t: any) => ({
        ...t,
        nomeCompleto: t.contact_name ?? 'Cliente não informado',
        telefone: t.telefone ?? '',
        email: t.email ?? '',
        empresa: t.empresa ?? '',
        due_date: t.due_date ?? '',

      }));

      setTasks(dadosCompletos);
    });
  }, []);

  const tarefasSemana = useMemo(() => {
    return tasks.filter(task => {
      const data = dayjs(task?.due_date);
      const dias = data.diff(hoje, 'day');

      return dias >= 0 && dias <= 7;
    });
  }, [tasks]);

  const tarefasPorDia = useMemo(() => {
    return tarefasSemana.reduce((acc: Record<string, Task[]>, task) => {

      const chaveDia = dayjs(task?.due_date).format('YYYY-MM-DD');

      acc[chaveDia] = acc[chaveDia] ? [...acc[chaveDia], task] : [task];
      return acc;
    }, {});
  }, [tarefasSemana]);

  const tarefasDoDia = useMemo(() => {
    const lista = tarefasPorDia[selectedDay ?? ''] ?? [];
    return lista.filter(task =>
      task.id?.toLowerCase().includes(filtroCliente.toLowerCase()) &&
      (!selectedDate || dayjs(task?.due_date).isSame(selectedDate, 'day'))
    );
  }, [tarefasPorDia, selectedDay, filtroCliente, selectedDate]);

  const tarefasPaginadas = tarefasDoDia.slice(
    (paginaDoDia - 1) * ITEMS_PER_PAGE,
    paginaDoDia * ITEMS_PER_PAGE
  );

  const handleCancelar = (task: Task) => {
    alert(`Cancelar tarefa de ${task.nomecompleto}`);
  };
  // const handleDetalhe = async (taskId: string) => {
  //     console.log('Detalhe da tarefa:', taskId);
  //   const res = await dataProvider.getOne('view_detalhe_cliente', { id: taskId });

  //   setSelectedTask(res.data as Task);
  // };

  const handleDetalhe = async (taskId: string) => {
    console.log('Detalhe da tarefa:', taskId);
    const res = await dataProvider.getList('view_detalhe_cliente', {
      pagination: { page: 1, perPage: 1 },
      sort: { field: 'id', order: 'ASC' },
      filter: { id: taskId }
    }).then(res => {
    
      const dadosView: Task[] = res.data.map((t: any) => ({
        ...t,
        nomeCompleto: t.nomecompleto ?? 'Cliente não informado',
        telefone: t.telefone ?? '',
        email: t.email ?? '',
        empresa: t.empresa ?? '',
        due_date: t.due_date ?? '',

      }));

      if (dadosView.length > 0) {
        setSelectedTask(dadosView[0]);
      } else {
        alert('Dados detalhados não encontrados.');
      }
    });
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>📆 Agenda Semanal</Typography>

      <Grid container spacing={2}>
        {Object.entries(tarefasPorDia).map(([dataIso, lista]) => (
          <Grid item xs={12} sm={6} md={4} key={dataIso}>
            <Card
              onClick={() => {
                setSelectedDay(dataIso);
                setPaginaDoDia(1);
                setFiltroCliente('');
                setSelectedDate(null);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <CardContent>
                <Typography variant="h6">{dayjs(dataIso).format('dddd')}</Typography>
                <Typography variant="body2">{lista.length} compromissos</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedDay && (
        <Box mt={4}>
          <Typography variant="h6">📌 Compromissos de {dayjs(selectedDay).format('dddd')}</Typography>

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
                <Typography variant="subtitle1" fontWeight="bold">👤 Cliente: {task.nomecompleto}</Typography>
                <Typography variant="body2">🧑‍💼 Responsável: {task.responsavel}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  🕒 {dayjs(task?.due_date).format('HH:mm')} | 🎯 {task.objetivo}
                </Typography>
                <Box mt={2} display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={async () => {
                      const res = await dataProvider.getList('view_detalhe_cliente', {
                        pagination: { page: 1, perPage: 1 },
                        sort: { field: 'id', order: 'ASC' },
                        filter: { id: task.id },
                      });

                      if (res.data.length > 0) {
                        const dadosCompletos = res.data[0] as Task;
                        console.log('aquiiii oi', dadosCompletos)
                        setTaskReagendarId(task.id);
                        setSelectedTask(dadosCompletos); // 👈 Passa os dados para o TaskEdit
                      } else {
                        alert('Dados detalhados não encontrados para reagendamento.');
                      }
                    }}
                  >
                    Reagendar
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleCancelar(task)}>Cancelar</Button>
                  <Button variant="outlined" onClick={() => handleDetalhe(task.id)}>Ver detalhes</Button>
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
          selectedData={selectedTask} // 👈 Isso está certo!
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
              <Typography><strong>Cliente:</strong> {selectedTask.nomecompleto}</Typography>
              <Typography><strong>Empresa:</strong> {selectedTask.empresa}</Typography>
              <Typography><strong>Contato:</strong> {selectedTask.email}</Typography>
              <Typography><strong>Objetivo:</strong> {selectedTask.objetivo}</Typography>
              <Typography><strong>Ações Pós-Visita:</strong> {selectedTask.acoesPosVisita}</Typography>
              <Typography><strong>Prioridade:</strong> {selectedTask.prioridade}</Typography>
              <Typography>
                <strong>Data:</strong> {dayjs(selectedTask?.due_date).format('dddd, DD/MM/YYYY HH:mm')}
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
