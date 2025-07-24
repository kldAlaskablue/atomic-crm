import {
  Box, Card, CardContent, Typography, TextField, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect, useState, useMemo } from 'react';
import { dataProvider } from '../providers/supabase';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

interface ClienteHistorico {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  codigoCliente: string;
  dataCadastro: string;
  status: 'ativo' | 'inativo' | 'prospecto';
  origem: string;
  empresa: string;
  ramo: string;
  porte: string;
  decisores: string;
  preferencias: string;
  observacoes: string;
  acaoFutura: string;
  vendedor: string;
  compras: {
    data: string;
    produto: string;
    quantidade: number;
    valor: number;
    formaPagamento: string;
  }[];
  interacoes: {
    tipo: string;
    data: string;
    assunto: string;
    detalhes: string;
    status: string;
    vendedor: string;
  }[];
  solicitacoes: {
    tipo: string;
    data: string;
    assunto: string;
    status: string;
    acaoTomada: string;
    feedback: string;
  }[];
}

const HistoricoPorCliente = () => {
  const [dados, setDados] = useState<ClienteHistorico[]>([]);
  const [filtroNome, setFiltroNome] = useState('');
  const [dataInicio, setDataInicio] = useState<Dayjs | null>(null);
  const [dataFim, setDataFim] = useState<Dayjs | null>(null);
  const [clienteSelecionado, setClienteSelecionado] = useState<ClienteHistorico | null>(null);

  useEffect(() => {
  const dadosSimulados: ClienteHistorico[] = [
    {
      id: 'cli001',
      nome: 'João Silva',
      telefone: '(11) 98888-0000',
      email: 'joao.silva@exemplo.com',
      endereco: 'Rua das Flores, 123, São Paulo - SP',
      codigoCliente: 'C1001',
      dataCadastro: '2022-03-15',
      status: 'ativo',
      origem: 'Indicação',
      empresa: 'ACME Ltda',
      ramo: 'Logística',
      porte: 'Médio',
      decisores: 'João Silva, Carla Mendes',
      preferencias: 'Produtos sustentáveis, contato por WhatsApp',
      observacoes: 'Busca soluções ágeis e com suporte constante.',
      acaoFutura: 'Agendar demonstração até 25/07 com Paulo',
      vendedor: 'Paulo Castro',
      compras: [
        {
          data: '2023-11-10',
          produto: 'Caixas térmicas',
          quantidade: 50,
          valor: 12000,
          formaPagamento: 'Cartão'
        }
      ],
      interacoes: [
        {
          tipo: 'Reunião',
          data: '2024-01-15T10:00',
          assunto: 'Nova linha de produtos',
          detalhes: 'Cliente solicitou amostras',
          status: 'resolvido',
          vendedor: 'Paulo Castro'
        }
      ],
      solicitacoes: [
        {
          tipo: 'Reclamação',
          data: '2024-05-10',
          assunto: 'Entrega atrasada',
          status: 'resolvido',
          acaoTomada: 'Contato imediato e envio emergencial',
          feedback: 'Cliente satisfeito com resposta'
        }
      ]
    }
  ];
  setDados(dadosSimulados);
}, []);


  useEffect(() => {
    dataProvider.getList('clientes_historico', {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'nome', order: 'ASC' },
      filter: {},
    }).then(response => setDados(response.data as ClienteHistorico[]));
  }, []);

  const clientesFiltrados = useMemo(() =>
    dados.filter(cliente =>
      cliente.nome?.toLowerCase().includes(filtroNome.toLowerCase()) &&
      (!dataInicio || dayjs(cliente.dataCadastro).isAfter(dataInicio.subtract(1, 'day'))) &&
      (!dataFim || dayjs(cliente.dataCadastro).isBefore(dataFim.add(1, 'day')))
    ), [dados, filtroNome, dataInicio, dataFim]);

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>📚 Histórico por Cliente</Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Filtrar por nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            label="Data início"
            value={dataInicio}
            onChange={setDataInicio}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <DatePicker
            label="Data fim"
            value={dataFim}
            onChange={setDataFim}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>

      {clientesFiltrados.map(cliente => (
        <Card key={cliente.id} sx={{ mb: 2 }}>
          <CardContent onClick={() => setClienteSelecionado(cliente)} sx={{ cursor: 'pointer' }}>
            <Typography variant="h6">{cliente.nome}</Typography>
            <Typography variant="body2">📞 {cliente.telefone} | ✉️ {cliente.email}</Typography>
            <Typography variant="body2">🏢 {cliente.empresa} | 🔗 {cliente.status}</Typography>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!clienteSelecionado} onClose={() => setClienteSelecionado(null)} fullWidth maxWidth="md">
        <DialogTitle>🧾 Histórico detalhado</DialogTitle>
        <DialogContent dividers>
          {clienteSelecionado && (
            <Box display="grid" gap={2}>
              {/* Identificação */}
              <Typography><strong>Nome:</strong> {clienteSelecionado.nome}</Typography>
              <Typography><strong>Contato:</strong> {clienteSelecionado.telefone} / {clienteSelecionado.email}</Typography>
              <Typography><strong>Endereço:</strong> {clienteSelecionado.endereco}</Typography>
              <Typography><strong>Cadastro:</strong> {dayjs(clienteSelecionado.dataCadastro).format('DD/MM/YYYY')}</Typography>
              <Typography><strong>Status:</strong> {clienteSelecionado.status}</Typography>
              <Typography><strong>Código:</strong> {clienteSelecionado.codigoCliente}</Typography>
              <Typography><strong>Fonte:</strong> {clienteSelecionado.origem}</Typography>

              {/* Empresa */}
              <Typography><strong>Empresa:</strong> {clienteSelecionado.empresa}</Typography>
              <Typography><strong>Ramo:</strong> {clienteSelecionado.ramo}</Typography>
              <Typography><strong>Porte:</strong> {clienteSelecionado.porte}</Typography>
              <Typography><strong>Decisores:</strong> {clienteSelecionado.decisores}</Typography>

              {/* Preferências e Observações */}
              <Typography><strong>Preferências:</strong> {clienteSelecionado.preferencias}</Typography>
              <Typography><strong>Observações:</strong> {clienteSelecionado.observacoes}</Typography>
              <Typography><strong>Ações Futuras:</strong> {clienteSelecionado.acaoFutura}</Typography>

              {/* Compras */}
              <Typography variant="h6" mt={2}>🛒 Histórico de Compras</Typography>
              {clienteSelecionado.compras.map((compra, index) => (
                <Typography key={index}>
                  {dayjs(compra.data).format('DD/MM/YYYY')} – {compra.produto} ({compra.quantidade} un.) – R$ {compra.valor} – {compra.formaPagamento}
                </Typography>
              ))}

              {/* Interações */}
              <Typography variant="h6" mt={2}>📞 Interações com Vendedores</Typography>
              {clienteSelecionado.interacoes.map((int, index) => (
                <Typography key={index}>
                  {dayjs(int.data).format('DD/MM/YYYY HH:mm')} – {int.tipo} sobre "{int.assunto}" – {int.status} – {int.vendedor}
                </Typography>
              ))}

              {/* Reclamações */}
              <Typography variant="h6" mt={2}>📮 Solicitações e Reclamações</Typography>
              {clienteSelecionado.solicitacoes.map((sol, index) => (
                <Typography key={index}>
                  {dayjs(sol.data).format('DD/MM/YYYY')} – {sol.tipo} | {sol.assunto} – {sol.status}
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClienteSelecionado(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HistoricoPorCliente;

