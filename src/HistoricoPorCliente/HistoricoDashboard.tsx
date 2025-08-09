import {
  Box, Typography, Grid, Card, CardContent, TextField,
  Select, MenuItem, Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';
import Papa from 'papaparse';
import { useEffect, useState, useMemo } from 'react';
import { dataProvider } from '../providers/supabase';

dayjs.locale('pt-br');

interface TaskHistory {
  id: string;
  task_id_original: string;
  task_type?: string;
  contact_name?: string;
  assigned_to_name?: string;
  time?: string;
  due_date?: string;
  status?: string;
  reagendado_em?: string;
  created_at?: string;
  observacao_vendedor?: string;
  email?: string;
  empresa?: string;
  nome?: string;
  telefone?: string;
}

const corDoStatus: Record<string, string> = {
  Reagendado: '#1976d2',
  Concluído: '#2e7d32',
  Pendente: '#ed6c02',
};

const safeDateFormat = (data?: string) =>
  data && dayjs(data).isValid() ? dayjs(data).format('DD/MM/YYYY HH:mm') : '—';

export default function HistoricoDashboard() {
  const [dados, setDados] = useState<TaskHistory[]>([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState<Dayjs | null>(null);
  const [dataFim, setDataFim] = useState<Dayjs | null>(null);

  useEffect(() => {
    dataProvider.getList('task_history', {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'created_at', order: 'DESC' },
      filter: {},
    }).then(res => {
      console.log("📥 Dados recebidos:", res.data);
      setDados(res.data as TaskHistory[]);
    });
  }, []);

  const filtrados = useMemo(() => {
    const log = {
      total: dados.length,
      porNome: 0,
      porStatus: 0,
      porDataInicio: 0,
      porDataFim: 0,
      final: 0,
    };

    const resultado = dados
      .filter(item => {
        const passouNome = filtroNome === '' || item.nome?.toLowerCase().includes(filtroNome.toLowerCase());
        if (passouNome) log.porNome++;
        return passouNome;
      })
      .filter(item => {
        const passouStatus = !statusSelecionado || item.status === statusSelecionado;
        if (passouStatus) log.porStatus++;
        return passouStatus;
      })
      .filter(item => {
        const passouInicio = !dataInicio || (item.created_at && dayjs(item.created_at).isAfter(dataInicio.subtract(1, 'day')));
        if (passouInicio) log.porDataInicio++;
        return passouInicio;
      })
      .filter(item => {
        const passouFim = !dataFim || (item.created_at && dayjs(item.created_at).isBefore(dataFim.add(1, 'day')));
        if (passouFim) log.porDataFim++;
        return passouFim;
      });

    log.final = resultado.length;
    console.log("🔍 Log do filtro aplicado:", log);
    return resultado;
  }, [dados, filtroNome, statusSelecionado, dataInicio, dataFim]);

  const colunas: GridColDef[] = [
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'telefone', headerName: 'Telefone', flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    { field: 'empresa', headerName: 'Empresa', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Box
          px={1.5}
          py={0.5}
          borderRadius={1}
          sx={{
            backgroundColor: corDoStatus[params.value as string] ?? '#e0e0e0',
            color: '#fff',
            fontWeight: 500,
            fontSize: '0.9rem',
          }}
        >
          {params.value ?? '—'}
        </Box>
      ),
    },
    {
      field: 'reagendado_em',
      headerName: 'Reagendado em',
      flex: 1,
      valueGetter: (params: { row: TaskHistory }) =>
        safeDateFormat(params.row.reagendado_em),
    },
  ];

  const exportarCSV = () => {
    const csv = Papa.unparse(filtrados);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'reagendamentos.csv';
    link.click();
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>📊 Dashboard de Reagendamentos</Typography>

      {/* KPIs */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Total</Typography>
              <Typography variant="h5">{filtrados.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {['Reagendado', 'Concluído', 'Pendente'].map(status => (
          <Grid item xs={12} md={3} key={status}>
            <Card sx={{ borderLeft: `6px solid ${corDoStatus[status]}` }}>
              <CardContent>
                <Typography variant="subtitle2">{status}</Typography>
                <Typography variant="h5">
                  {filtrados.filter(item => item.status === status).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filtros */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Buscar por nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Select
            value={statusSelecionado}
            onChange={(e) => setStatusSelecionado(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="">Todos os status</MenuItem>
            <MenuItem value="Reagendado">Reagendado</MenuItem>
            <MenuItem value="Concluído">Concluído</MenuItem>
            <MenuItem value="Pendente">Pendente</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={3}>
          <DatePicker
            label="Data início"
            value={dataInicio}
            onChange={setDataInicio}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DatePicker
            label="Data fim"
            value={dataFim}
            onChange={setDataFim}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>

      {/* Botão exportar */}
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button variant="outlined" onClick={exportarCSV}>
          📁 Exportar CSV
        </Button>
      </Box>

      {/* Tabela */}
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filtrados}
          columns={colunas}
          getRowId={(row) => row.id || row.task_id_original}
          pageSizeOptions={[10, 20, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </div>
    </Box>
  );
}
