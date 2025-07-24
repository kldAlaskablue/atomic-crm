import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Button, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { dataProvider } from '../providers/supabase';

interface NovaTarefaModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  dataSugestao?: Dayjs | null;
}

const NovaTarefaModal = ({
  open,
  onClose,
  onCreated,
  dataSugestao
}: NovaTarefaModalProps) => {
  const [leads, setLeads] = useState<{ id: string; nome: string }[]>([]);
  const [responsaveis, setResponsaveis] = useState<string[]>([]);
  const [leadId, setLeadId] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<Dayjs | null>(dataSugestao ?? null);
  const [responsavel, setResponsavel] = useState('');
  const [prioridade, setPrioridade] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) return;

    dataProvider.getList('leads', {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'nome', order: 'ASC' },
      filter: {},
    }).then(res => {
      const lista = res.data.map((lead: any) => ({ id: lead.id, nome: lead.nome }));
      setLeads(lista);
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;

    dataProvider.getList('users', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'nome', order: 'ASC' },
      filter: { ativo: true },
    }).then(res => {
      const nomes = res.data.map((u: any) => u.nome);
      setResponsaveis(nomes);
    });
  }, [open]);

  const handleSalvar = async () => {
    if (!leadId || !dataSelecionada || !responsavel) {
      alert('Preencha cliente, data e responsável!');
      return;
    }

    setSalvando(true);
    try {
      await dataProvider.create('tasks', {
        data: {
          lead_id: leadId,
          objetivo,
          due_date: dataSelecionada.toISOString(),
          responsavel,
          prioridade,
          status: 'Pendente' // ✅ campo obrigatório para Kanban
        },
      });

      onCreated?.();
      handleFechar();
    } catch (err) {
      alert('Erro ao salvar tarefa');
    } finally {
      setSalvando(false);
    }
  };

  const handleFechar = () => {
    setLeadId('');
    setObjetivo('');
    setResponsavel('');
    setPrioridade('');
    setDataSelecionada(dataSugestao ?? null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleFechar} fullWidth maxWidth="md">
      <DialogTitle>➕ Nova Tarefa</DialogTitle>
      <DialogContent dividers>
        <Box display="grid" gap={2}>
          <FormControl fullWidth>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={leadId}
              label="Cliente"
              onChange={(e) => setLeadId(e.target.value)}
            >
              {leads.map(lead => (
                <MenuItem key={lead.id} value={lead.id}>{lead.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Objetivo"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Responsável</InputLabel>
            <Select
              value={responsavel}
              label="Responsável"
              onChange={(e) => setResponsavel(e.target.value)}
            >
              {responsaveis.map(nome => (
                <MenuItem key={nome} value={nome}>{nome}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Prioridade</InputLabel>
            <Select
              value={prioridade}
              label="Prioridade"
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <MenuItem value="Alta">🔥 Alta</MenuItem>
              <MenuItem value="Média">⚖️ Média</MenuItem>
              <MenuItem value="Baixa">🍃 Baixa</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            label="Data"
            value={dataSelecionada}
            onChange={(date) => setDataSelecionada(date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleFechar}>Cancelar</Button>
        <Button variant="contained" onClick={handleSalvar} disabled={salvando}>
          {salvando ? 'Salvando...' : '💾 Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NovaTarefaModal;

