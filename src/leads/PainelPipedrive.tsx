import {
  Box, Grid, Typography, Card, CardContent, Button,
  Snackbar, Alert, TextField, MenuItem, CircularProgress
} from '@mui/material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { dataProvider } from '../providers/supabase';
//import { supabase } from '../lib/supabase'; // sua instância do Supabase

const fasesFunil = [
  'Novo Lead',
  'Contato Iniciado',
  'Necessidade Identificada',
  'Proposta Enviada',
  'Negociação',
  'Fechado (Ganho)',
  'Fechado (Perdido)'
];

const PainelPipedrive = () => {
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null);
  const [leadsPorFase, setLeadsPorFase] = useState<Record<string, any[]>>({});
  const [todosLeads, setTodosLeads] = useState<any[]>([]);
  const [snackbarAberto, setSnackbarAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const [responsavelSelecionado, setResponsavelSelecionado] = useState('');
  const [listaResponsaveis, setListaResponsaveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      const { data: { user } } = await dataProvider.auth.getUser();
      const res = await dataProvider
        .from('usuarios')
        .select('*')
        .eq('id', user?.id)
        .single();
      setUsuarioLogado(res.data);
    };
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (usuarioLogado) carregarLeads();
  }, [busca, responsavelSelecionado, usuarioLogado]);

  const carregarLeads = async () => {
    setLoading(true);

    const filtro = usuarioLogado.tipo === 'admin'
      ? (responsavelSelecionado ? { responsavel: responsavelSelecionado } : {})
      : { responsavel: usuarioLogado.nome };

    const resLeads = await dataProvider.getList('leads', {
      pagination: { page: 1, perPage: 500 },
      sort: { field: 'nome', order: 'ASC' },
      filter: filtro
    });

    const leadsFiltrados = resLeads.data.filter((lead: any) =>
      lead.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      lead.empresa?.toLowerCase().includes(busca.toLowerCase())
    );

    const agrupado: Record<string, any[]> = {};
    fasesFunil.forEach(f => agrupado[f] = []);
    leadsFiltrados.forEach((lead: any) => {
      const faseAtual = lead.status || 'Novo Lead';
      agrupado[faseAtual]?.push(lead);
    });

    setLeadsPorFase(agrupado);
    setTodosLeads(resLeads.data);

    const responsaveisUnicos = Array.from(new Set(resLeads.data.map((l: any) => l.responsavel)));
    setListaResponsaveis(responsaveisUnicos);
    setLoading(false);
  };

  const formatPhone = (tel?: string) => tel ? tel.replace(/\D/g, '') : '';

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const leadMovido = leadsPorFase[source.droppableId].find(l => l.id === draggableId);
    const novoLeadsPorFase = { ...leadsPorFase };

    novoLeadsPorFase[source.droppableId] = novoLeadsPorFase[source.droppableId].filter(l => l.id !== draggableId);
    novoLeadsPorFase[destination.droppableId].push({ ...leadMovido, status: destination.droppableId });
    setLeadsPorFase(novoLeadsPorFase);

    await dataProvider.update('leads', {
      id: draggableId,
      data: { status: destination.droppableId },
      previousData: leadMovido
    });

    setSnackbarAberto(true);
    await carregarLeads();
  };

  if (!usuarioLogado || loading) {
    return (
      <Box mt={4} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Carregando painel estratégico...</Typography>
      </Box>
    );
  }

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>📊 Funil de Vendas Estilo Pipedrive</Typography>

      <Box mb={2} display="flex" gap={2} flexWrap="wrap">
        <TextField
          label="🔍 Buscar nome ou empresa"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          variant="outlined"
        />
        {usuarioLogado.tipo === 'admin' && (
          <TextField
            label="👤 Filtrar por responsável"
            select
            value={responsavelSelecionado}
            onChange={(e) => setResponsavelSelecionado(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todos</MenuItem>
            {listaResponsaveis.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          {fasesFunil.map((fase) => (
            <Grid item xs={12} md={3} key={fase}>
              <Droppable droppableId={fase}>
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 2, minHeight: 500 }}>
                    <Typography variant="h6" mb={1}>{fase} ({leadsPorFase[fase]?.length || 0})</Typography>
                    {leadsPorFase[fase]?.map((lead, index) => {
                      const diasParado = lead.dataUltimaAtualizacao
                        ? dayjs().diff(dayjs(lead.dataUltimaAtualizacao), 'day')
                        : null;

                      return (
                        <Draggable draggableId={lead.id} index={index} key={lead.id}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: 1, bgcolor: diasParado && diasParado > 5 ? '#fff3e0' : 'white' }}
                            >
                              <CardContent>
                                <Typography variant="subtitle1">{lead.nome}</Typography>
                                <Typography variant="body2">🏢 {lead.empresa}</Typography>
                                <Typography variant="body2">📍 {lead.origem}</Typography>
                                <Typography variant="body2">🎯 {lead.interesse}</Typography>
                                <Typography variant="body2">👤 Resp: {lead.responsavel}</Typography>
                                {diasParado && (
                                  <Typography variant="caption" color="error">
                                    ⏳ Parado há {diasParado} dias
                                  </Typography>
                                )}
                                <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                                  <Button size="small" href={`https://wa.me/${formatPhone(lead.whatsapp || lead.telefone)}?text=${encodeURIComponent(`Olá ${lead.nome}, tudo certo com sua proposta?`)}`} target="_blank">WhatsApp</Button>
                                  {lead.usuarioInstagram && (
                                    <Button size="small" href={`https://instagram.com/${lead.usuarioInstagram}`} target="_blank">Instagram</Button>
                                  )}
                                  {lead.usuarioFacebook && (
                                    <Button size="small" href={`https://facebook.com/${lead.usuarioFacebook}`} target="_blank">Facebook</Button>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>
      </DragDropContext>

            <Snackbar
        open={snackbarAberto}
        autoHideDuration={3000}
        onClose={() => setSnackbarAberto(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarAberto(false)}>
          Lead movido com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PainelPipedrive;
