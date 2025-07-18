import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  CircularProgress,
  Stack,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { dataProvider } from '../providers/supabase';

type NovaTarefaModalProps = {
  open: boolean;
  close: () => void;
  onSaved?: () => void;
};

type Lead = {
  id: string;
  nome: string;
  telefone: string;
};

const NovaTarefaModal = ({ open, close, onSaved }: NovaTarefaModalProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadSelecionado, setLeadSelecionado] = useState<Lead | null>(null);
  const [taskType, setTaskType] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      dataProvider
        .getList('leads', {
          pagination: { page: 1, perPage: 50 },
          sort: { field: 'id', order: 'DESC' },
          filter: {},
        })
        .then((res) => setLeads(res.data));
    }
  }, [open]);

  const handleSave = async () => {
    if (!leadSelecionado || !taskType || !assignedTo || !dueDate || !time) return;

    setLoading(true);
    try {
      await dataProvider.create('tasks', {
        data: {
          contact_name: leadSelecionado.nome,
          lead_id: leadSelecionado.id,
          task_type: taskType,
          assigned_to_name: assignedTo,
          due_date: `${dueDate}T${time}`,
          status: 'Pendente',
        },
      });
      close();
      onSaved?.();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao salvar tarefa. Verifique os campos ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle sx={{ mb: '2rem' }}>➕ Nova Tarefa Comercial</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Autocomplete
            options={leads}
            getOptionLabel={(lead) => `${lead.nome} — ${lead.telefone}`}
            value={leadSelecionado}
            onChange={(_, novoLead) => setLeadSelecionado(novoLead)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Selecione o cliente"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <TextField
            label="Tipo de tarefa"
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            select
            fullWidth
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            <MenuItem value="Ligação">Ligação</MenuItem>
            <MenuItem value="Reunião">Reunião</MenuItem>
            <MenuItem value="Proposta">Proposta</MenuItem>
          </TextField>

          <TextField
            label="Responsável"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Data"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Horário"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <Stack direction="row" spacing={2}>
            <Button variant="outlined" onClick={close}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Salvar Tarefa'}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default NovaTarefaModal;
