import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useState } from 'react';
import { dataProvider } from '../providers/supabase';

type OrigemData = { label: string; value: number };
type EtapaData = { label: string; value: number };
type DiariaData = { dia: string; cadastros: number };

type RelatorioData = {
  origem: OrigemData[];
  etapa: EtapaData[];
  diarios: DiariaData[];
};

const cores = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#b71c1c', '#2e7d32'];

const RelatorioComercial = () => {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [dados, setDados] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(false);

  const gerarRelatorio = async () => {
    if (!inicio || !fim) return;

    setLoading(true);
    try {
      const res = await dataProvider.getList('leads', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'data_criacao', order: 'ASC' },
        filter: {
          data_criacao: { $gte: inicio, $lte: fim },
        },
      });

      const leads = res.data;

      // Origem
      const porOrigem: Record<string, number> = {};
      leads.forEach((l) => {
        porOrigem[l.origem] = (porOrigem[l.origem] || 0) + 1;
      });

      const origem: OrigemData[] = Object.entries(porOrigem).map(([label, value]) => ({ label, value }));

      // Etapa
      const porEtapa: Record<string, number> = {};
      leads.forEach((l) => {
        porEtapa[l.etapa] = (porEtapa[l.etapa] || 0) + 1;
      });

      const etapa: EtapaData[] = Object.entries(porEtapa).map(([label, value]) => ({ label, value }));

      // Diária
      const porDia: Record<string, number> = {};
      leads.forEach((l) => {
        const dia = l.data_criacao.slice(0, 10);
        porDia[dia] = (porDia[dia] || 0) + 1;
      });

      const diarios: DiariaData[] = Object.entries(porDia)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([dia, cadastros]) => ({ dia, cadastros }));

      setDados({ origem, etapa, diarios });
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📈 Relatório Comercial por Período
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Início"
          type="date"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fim"
          type="date"
          value={fim}
          onChange={(e) => setFim(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={gerarRelatorio}>Gerar</Button>
      </Box>

      {loading && <CircularProgress />}

      {dados && !loading && (
        <Box>
          <Typography variant="h6" gutterBottom>
            📊 Leads por Origem
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dados.origem}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ label }) => label}
              >
                {dados.origem.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={cores[i % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            🚦 Leads por Etapa
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dados.etapa}>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            📅 Evolução Diária de Cadastros
          </Typography>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dados.diarios}>
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cadastros" stroke="#388e3c" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default RelatorioComercial;
