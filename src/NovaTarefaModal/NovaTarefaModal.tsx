import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Button, Select, MenuItem,
  FormControl, InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
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
  const [horaSelecionada, setHoraSelecionada] = useState('');
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
    if (!leadId || !dataSelecionada || !horaSelecionada || !responsavel) {
      alert('Preencha cliente, data, horário e responsável!');
      return;
    }

    setSalvando(true);
    try {
      const dataHoraFinal = dayjs(`${dataSelecionada?.format('YYYY-MM-DD')}T${horaSelecionada}`).format('YYYY-MM-DD HH:mm:ss');

      await dataProvider.create('tasks', {
        data: {
          lead_id: leadId,
          contact_name: leads.find(l => l.id === leadId)?.nome ?? '',
          objetivo,
          due_date: dataHoraFinal,
          responsavel,
          prioridade,
          status: 'Pendente'
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
    setHoraSelecionada('');
    setDataSelecionada(dataSugestao ?? null);
    onClose();
  };

  const gerarOpcoesHorario = () => {
    const horarios = [];
    for (let h = 8; h <= 18; h++) {
      horarios.push(`${String(h).padStart(2, '0')}:00`);
      horarios.push(`${String(h).padStart(2, '0')}:30`);
    }
    return horarios;
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
            label="Data do Compromisso"
            value={dataSelecionada}
            onChange={(date) => setDataSelecionada(date)}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <FormControl fullWidth>
            <InputLabel>Horário</InputLabel>
            <Select
              value={horaSelecionada}
              label="Horário"
              onChange={(e) => setHoraSelecionada(e.target.value)}
            >
              {gerarOpcoesHorario().map(hora => (
                <MenuItem key={hora} value={hora}>{hora}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
