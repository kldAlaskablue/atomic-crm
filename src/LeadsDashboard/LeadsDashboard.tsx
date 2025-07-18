import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Divider,
  Stack,
  Snackbar,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { dataProvider } from '../providers/supabase';
import LeadEtapaSelector from './LeadEtapaSelector';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';

type Lead = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  origem: string;
  interesse: string;
  etapa: string;
  status: string;
  data_criacao: string;
  responsavel: string;
  proxima_acao?: string;
};

const etapas = [
  'novo',
  'qualificado',
  'reunião agendada',
  'proposta enviada',
  'negócio fechado',
  'perdido',
];

const corPorEtapa: Record<string, string> = {
  novo: '#1976d2',
  qualificado: '#388e3c',
  'reunião agendada': '#f57c00',
  'proposta enviada': '#7b1fa2',
  'negócio fechado': '#2e7d32',
  perdido: '#b71c1c',
};

const LeadsDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    origem: 'manual',
    interesse: '',
    proxima_acao: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  const [followupCount, setFollowupCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const fetchLeads = async () => {
    const res = await dataProvider.getList('leads', {
      pagination: { page: 1, perPage: 100 },
      sort: { field: 'data_criacao', order: 'DESC' },
      filter: {},
    });

    setLeads(res.data);

    const hoje = new Date().toISOString().slice(0, 10);
    const pendentes = res.data.filter(
      (lead: Lead) =>
        lead.proxima_acao && lead.proxima_acao.slice(0, 10) <= hoje
    );
    setFollowupCount(pendentes.length);
  };

  useEffect(() => {
    fetchLeads();
    const intervalo = setInterval(() => {
      fetchLeads();
    }, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const handleCadastrarLead = async () => {
    const hoje = new Date().toISOString().slice(0, 10);
    if (!form.proxima_acao || form.proxima_acao < hoje) {
      setSuccessToast('⚠️ A data de follow-up precisa estar no futuro!');
      return;
    }

    const payload = {
      ...form,
      id: uuidv4(),
      etapa: 'novo',
      status: 'ativo',
      data_criacao: new Date().toISOString(),
      responsavel: 'comercial-1',
      proxima_acao: new Date(form.proxima_acao).toISOString(),
    };

    await dataProvider.create('leads', { data: payload });

    await dataProvider.create('tasks', {
      data: {
        task_type: 'Follow-up com Lead',
        contact_name: payload.nome,
        assigned_to_name: payload.responsavel,
        due_date: payload.proxima_acao,
        lead_id: payload.id,
        status: 'Pendente',
      },
    });

    fetchLeads();
    setForm({
      nome: '',
      email: '',
      telefone: '',
      origem: 'manual',
      interesse: '',
      proxima_acao: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });
    setSnackbarOpen(true);
  };

  const handleExportLeads = () => {
    const planilha = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, planilha, 'Leads');
    XLSX.writeFile(workbook, 'leads.xlsx');
    setSuccessToast('📁 Leads exportados com sucesso!');
  };

  return (
    <Box mt={5}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🧠 Painel Comercial Inteligente
      </Typography>

      {followupCount > 0 && (
        <Snackbar
          open={true}
          message={`🔔 ${followupCount} leads precisam de follow-up!`}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
      )}

      {successToast && (
        <Snackbar
          open={true}
          message={successToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
          onClose={() => setSuccessToast('')}
        />
      )}

      <Button variant="outlined" sx={{ mb: 2 }} onClick={handleExportLeads}>
        📤 Exportar para Excel
      </Button>

      {/* Cadastro de lead */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6">📥 Novo Lead</Typography>
          <Stack spacing={2} mt={2}>
            <TextField label="Nome" fullWidth value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
            <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <TextField label="Telefone" fullWidth value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
            <TextField label="Interesse" fullWidth value={form.interesse} onChange={(e) => setForm((f) => ({ ...f, interesse: e.target.value }))} />
            <Select fullWidth value={form.origem} onChange={(e) => setForm((f) => ({ ...f, origem: e.target.value }))}>
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="site">Site</MenuItem>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
            </Select>
            <TextField
              label="Data de Follow-up"
              type="date"
              fullWidth
              value={form.proxima_acao}
              onChange={(e) => setForm((f) => ({ ...f, proxima_acao: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
            <Button variant="contained" onClick={handleCadastrarLead}>Cadastrar Lead</Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Funil por etapa */}
      <Typography variant="h6">🚦 Funil de Etapas</Typography>
      <Grid container spacing={2} mb={4}>
        {etapas.map((etapa) => {
          const count = leads.filter((l) => l.etapa === etapa).length;
          return (
            <Grid item xs={12} sm={6} md={4} key={etapa}>
              <Card sx={{ bgcolor: corPorEtapa[etapa], color: '#fff' }}>
                <CardContent>
                  <Typography variant="subtitle2">{etapa.toUpperCase()}</Typography>
                  <Typography variant="h4">{count}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      {/* Lista de leads */}
      <Typography variant="h6">📋 Leads Recentes</Typography>
      <Grid container spacing={3}>
        {leads.map((lead) => (
          <Grid item xs={12} md={6} lg={4} key={lead.id}>
            <Card sx={{ bgcolor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="h6">{lead.nome}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {lead.email ?? '—'} • {lead.telefone ?? '—'}<br />
                  Origem: {lead.origem} • Interesse: {lead.interesse ?? '—'}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>Etapa:</Typography>
                <LeadEtapaSelector
                  leadId={lead.id}
                  currentEtapa={lead.etapa}
                  onUpdated={fetchLeads}
                />

                {lead.proxima_acao && new Date(lead.proxima_acao) < new Date() && (
                  <Chip label="⚠️ Follow-up atrasado" color="error" sx={{ mt: 1 }} />
                )}

                <Stack direction="row" spacing={1} mt={2}>
                  {lead.email && <Chip label="✔ Email" color="success" />}
                  {lead.telefone && <Chip label="✔ Telefone" color="success" />}
                  {lead.interesse && <Chip label="✔ Interesse" color="success" />}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Toast de confirmação */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message="✅ Lead cadastrado com sucesso!"
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
};

export default LeadsDashboard;

