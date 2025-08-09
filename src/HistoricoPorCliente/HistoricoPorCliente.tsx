import {
  Box, Typography, Grid, Card, CardContent, TextField,
  Select, MenuItem, Button, Pagination
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Papa from 'papaparse';
import { useEffect, useState, useMemo } from 'react';
import { dataProvider } from '../providers/supabase';

dayjs.locale('pt-br');
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface TaskHistory {
  id: string;
  task_id_original: string;
  contact_name: string;
  assigned_to_name: string;
  telefone: string;
  email: string;
  empresa: string;
  status: string;
  reagendado_em: string;
  created_at: string;
  observacao_vendedor?: string; // Novo campo

}

const corDoStatus: Record<string, string> = {
  Reagendado: '#1976d2',
  Concluído: '#2e7d32',
  Pendente: '#ed6c02',
};

const safeDateFormat = (data?: string): string =>
  data && dayjs(data).isValid()
    ? dayjs(data).format('DD/MM/YYYY HH:mm')
    : '—';

export default function HistoricoPorCliente() {
  const [dados, setDados] = useState<TaskHistory[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(null);
  const [pagina, setPagina] = useState(1);
  const [filtroNome, setFiltroNome] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [dataInicio, setDataInicio] = useState<Dayjs | null>(null);
  const [dataFim, setDataFim] = useState<Dayjs | null>(null);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const carregar = async () => {
      const res = await dataProvider.getList('task_history', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'created_at', order: 'DESC' },
        filter: {},
      });

      const dadosFormatados: TaskHistory[] = res.data.map((t: any) => ({
        id: t.id ?? t.task_id_original ?? crypto.randomUUID(),
        task_id_original: t.task_id_original ?? '',
        contact_name: t.contact_name ?? 'Cliente não informado',
        telefone: t.telefone ?? '',
        email: t.email ?? '',
        empresa: t.empresa ?? '',
        status: t.status ?? '',
        reagendado_em: t.reagendado_em ?? '',
        assigned_to_name: t.assigned_to_name ?? '',
        created_at: t.created_at ?? '',
        observacao_vendedor: t.observacao_vendedor ?? '', // Novo campo
      }));

      setDados(dadosFormatados);
    };

    carregar();
  }, []);

  const filtrados = useMemo(() => {
    return dados.filter(item => {
      const passouNome = !filtroNome || item.contact_name.toLowerCase().includes(filtroNome.toLowerCase());
      const passouStatus = !statusSelecionado || item.status === statusSelecionado;
      const passouInicio = !dataInicio || dayjs(item.created_at).isSameOrAfter(dataInicio, 'day');
      const passouFim = !dataFim || dayjs(item.created_at).isSameOrBefore(dataFim, 'day');
      return passouNome && passouStatus && passouInicio && passouFim;
    });
  }, [dados, filtroNome, statusSelecionado, dataInicio, dataFim]);

  const agrupadoPorCliente = useMemo(() => {
    const agrupado: Record<string, TaskHistory[]> = {};
    filtrados.forEach(item => {
      const chave = item.contact_name;
      if (!agrupado[chave]) agrupado[chave] = [];
      agrupado[chave].push(item);
    });
    return agrupado;
  }, [filtrados]);

  const historicosSelecionados = clienteSelecionado ? agrupadoPorCliente[clienteSelecionado] ?? [] : [];
  const totalPaginas = Math.ceil(historicosSelecionados.length / ITEMS_PER_PAGE);
  const historicosPaginados = historicosSelecionados.slice((pagina - 1) * ITEMS_PER_PAGE, pagina * ITEMS_PER_PAGE);

  const exportarCSV = () => {
    const csv = Papa.unparse(filtrados);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'historico_por_cliente.csv';
    link.click();
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>🧾 Histórico por Cliente</Typography>

      {!clienteSelecionado && (
        <>
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

          <Box mb={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={exportarCSV}>
              📁 Exportar CSV
            </Button>
          </Box>

          <Grid container spacing={2}>
            {Object.entries(agrupadoPorCliente).map(([cliente, historicos]) => (
              <Grid item xs={12} md={6} key={cliente}>
                <Card
                  sx={{ cursor: 'pointer', transition: '0.3s', '&:hover': { boxShadow: 5 } }}
                  onClick={() => {
                    setClienteSelecionado(cliente);
                    setPagina(1);
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{cliente}</Typography>
                    <Typography variant="body2">📝 {historicos.length} histórico(s)</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {clienteSelecionado && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
            <Typography variant="h5">📂 Históricos de {clienteSelecionado}</Typography>
            <Button variant="outlined" onClick={() => setClienteSelecionado(null)}>⬅️ Voltar</Button>
          </Box>

          {historicosPaginados.map(item => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography><strong>Responsável:</strong> {item.assigned_to_name}</Typography>
                <Typography><strong>Status:</strong>{' '}
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: corDoStatus[item.status] ?? '#ccc',
                      color: '#fff',
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 1,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                    }}
                  >
                    {item.status}
                  </Box>
                </Typography>
                <Typography><strong>Empresa:</strong> {item.empresa}</Typography>
                <Typography><strong>E-mail:</strong> {item.email}</Typography>
                <Typography><strong>Telefone:</strong> {item.telefone}</Typography>
                <Typography><strong>Observação do vendedor:</strong> {item.observacao_vendedor || '—'}</Typography>
                <Typography><strong>Reagendado em:</strong> {safeDateFormat(item.reagendado_em)}</Typography>
              </CardContent>
            </Card>
          ))}

          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={(e, val) => setPagina(val)}
            sx={{ mt: 2 }}
          />
        </>
      )}
    </Box>
  );
}
