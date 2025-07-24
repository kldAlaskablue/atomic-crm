import {
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  Stack,
  DialogActions
} from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../providers/supabase/supabase';
import { dataProvider } from '../providers/supabase';

type TaskReagendarProps = {
  open: boolean;
  close: () => void;
  taskId: string;
  onSaved?: () => void;
};

export const TaskEdit = ({ open, close, taskId, onSaved }: TaskReagendarProps) => {
  const [originalTask, setOriginalTask] = useState<any>(null);
  const [responsavelId, setResponsavelId] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('');
  const [anotacao, setAnotacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!open || !taskId) return;

    const carregarDados = async () => {
      setFetching(true);

      try {
        const { data: taskRes } = await dataProvider.getOne('tasks', { id: taskId });
        const task = taskRes;
        setOriginalTask(task);
        setDueDate(task.due_date?.slice(0, 10) || '');
        setTime(task.due_date?.slice(11, 16) || '');

        const { data: userRes } = await supabase.auth.getUser();
        if (userRes?.user?.id) {
          setResponsavelId(userRes.user.id);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setOriginalTask(null);
      } finally {
        setFetching(false);
      }
    };

    carregarDados();
  }, [open, taskId]);

  const handleSave = async () => {
    if (!originalTask || !responsavelId || !dueDate || !time || !anotacao) return;

    const novaDueDate = `${dueDate}T${time}:00`;
    setLoading(true);

    try {
      await dataProvider.update('tasks', {
        id: originalTask.id,
        data: {
          due_date: novaDueDate,
          status: 'Reagendado',
        },
        previousData: originalTask,
      });

      await dataProvider.create('clientes', {
        data: {
          nome: originalTask.contact_name,
          telefone: originalTask.telefone || '',
          email: originalTask.email || '',
          empresa: originalTask.empresa || null,
          id_responsavel: responsavelId,
          fase: 'Reagendado',
          data_fase: new Date().toISOString(),
          anotacao,
          proposta_valor: null,
          proposta_data: null,
          proposta_status: null,
        }
      });

      close();
      onSaved?.();
    } catch (err) {
      console.error('Erro ao salvar reagendamento:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !originalTask) {
    return (
      <DialogContent>
        <CircularProgress />
      </DialogContent>
    );
  }

  return (
    <>
      <DialogTitle sx={{ mb: 2 }}>
        🕓 Reagendar tarefa de {originalTask.contact_name}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <TextField
            label="Nova data"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Novo horário"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
          />

          <TextField
            label="Anotação do vendedor"
            multiline
            value={anotacao}
            onChange={(e) => setAnotacao(e.target.value)}
            rows={4}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={close} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || !anotacao || !dueDate || !time}
        >
          {loading ? <CircularProgress size={20} /> : 'Salvar reagendamento'}
        </Button>
      </DialogActions>
    </>
  );
};

