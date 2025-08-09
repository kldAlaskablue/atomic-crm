import {
  Box, Card, CardContent, Typography, Button, Grid, Tabs, Tab
} from '@mui/material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { dataProvider } from '../providers/supabase';

import CardProposta from '../leads/CardProposta';
import CardReclamacao from '../leads/CardReclamacao';
import CardPreferencias from '../leads/CardPreferencias';
import CardAcoesFuturas from '../leads/CardAcoesFuturas';
import LeadFluxo from '../leads/LeadFluxo';

dayjs.locale('pt-br');
interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  empresa: string;
  canal_captacao: string;
  interesse: string;
  data_captacao: string;
  status: string;
  origem: string;
  responsavel: string;
  observacoes: string;
  usuarioInstagram?: string;
  usuarioFacebook?: string;
  whatsapp?: string;
}

interface EvolucaoLead {
  id: string;
  lead_id: string;
  fase: string;
  data: string;
  anotacao?: string;
}

const LeadsDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [fases, setFases] = useState<EvolucaoLead[]>([]);
  const [mensagensPorLead, setMensagensPorLead] = useState<Record<string, string[]>>({});
  const [abaSelecionadaPorLead, setAbaSelecionadaPorLead] = useState<Record<string, number>>({});

  useEffect(() => {
    const carregarDados = async () => {
      const [resLeads, resFases, resMensagens] = await Promise.all([
        dataProvider.getList('leads', { pagination: { page: 1, perPage: 200 }, sort: { field: 'nome', order: 'ASC' }, filter: {} }),
        dataProvider.getList('evolucao_lead', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'data', order: 'ASC' }, filter: {} }),
        dataProvider.getList('historico_mensagens', { pagination: { page: 1, perPage: 1000 }, sort: { field: 'data', order: 'ASC' }, filter: {} })
      ]);

      setLeads(resLeads.data as Lead[]);
      setFases(resFases.data as EvolucaoLead[]);

      const mensagensMap: Record<string, string[]> = {};
      (resMensagens.data as any[]).forEach(({ lead_id, mensagem, data }) => {
        console.log('Mensagem recebida:', lead_id, mensagem, data);
        if (!mensagensMap[lead_id]) mensagensMap[lead_id] = [];
        mensagensMap[lead_id].push(`${dayjs(data).format('DD/MM')} - ${mensagem}`);
      });
      setMensagensPorLead(mensagensMap);
    };

    carregarDados();
  }, []);

  const formatPhone = (tel?: string) => tel ? tel.replace(/\D/g, '') : '';

  const renderConteudoAba = (leadId: string, abaSelecionada: number, fasesDoLead: EvolucaoLead[], diasSemAcoes: number | null) => {
    switch (abaSelecionada) {
      case 0: return <CardProposta valor={12000} dataEnvio="10/07" validade="20/07" status="pendente" responsavel="Carlos Mendes" />;
      case 1: return <CardReclamacao tipo="Reclamação" data="05/07" assunto="Produto com defeito" status="resolvido" acaoTomada="Troca realizada em 24h" feedback="Cliente elogiou atendimento" />;
      case 2: return <CardPreferencias interesse="Linha premium" comunicacao="WhatsApp" segmento="Alimentos" porte="Grande" />;
      case 3: return <CardAcoesFuturas descricao="Agendar reunião até 25/07" responsavel="Paulo" prioridade="Alta" />;
      case 4:
        return (
          <>
            <LeadFluxo
              fases={fasesDoLead.map(f => ({ fase: f.fase, data: f.data, anotacao: f.anotacao }))}
              mensagens={mensagensPorLead[leadId] || []}
              leadId={leadId}
              onNovaFase={() => {
                dataProvider.getList('evolucao_lead', {
                  pagination: { page: 1, perPage: 1000 },
                  sort: { field: 'data', order: 'ASC' },
                  filter: {}
                }).then(res => setFases(res.data as EvolucaoLead[]));
              }}
            />
            {diasSemAcoes && diasSemAcoes > 5 && (
              <Box mt={2}>
                <Typography variant="body2" color="warning.main">
                  ⏳ Este lead está parado há {diasSemAcoes} dias
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  href={`https://wa.me/${formatPhone(leads.find(l => l.id === leadId)?.telefone)}?text=${encodeURIComponent(`Olá ${leads.find(l => l.id === leadId)?.nome}, seguimos disponíveis para apoiar você com sua proposta. Precisa de algo mais?`)}`}
                  target="_blank"
                >
                  📬 Enviar Follow-up
                </Button>
              </Box>
            )}
          </>
        );
      default: return null;
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>📣 Painel Estratégico de Leads</Typography>
      <Grid container spacing={3}>
        {leads.map((lead) => {
          const fasesDoLead = fases.filter(f => f.lead_id === lead.id);
          const ultimaFase = fasesDoLead.at(-1);
          const diasSemAcoes = ultimaFase ? dayjs().diff(dayjs(ultimaFase.data), 'day') : null;
          const abaSelecionada = abaSelecionadaPorLead[lead.id] ?? 0;

          return (
            <Grid item xs={12} md={6} key={lead.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{lead.nome}</Typography>
                  <Typography variant="body2">🏢 {lead.empresa} | 📞 {lead.telefone}</Typography>
                  <Typography variant="body2">✉️ {lead.email} | 📍 {lead.origem}</Typography>
                  <Typography variant="body2">🎯 Interesse: {lead.interesse}</Typography>
                  <Typography variant="body2">⚙️ Status: {lead.status}</Typography>
                  <Typography variant="body2">👤 Responsável: {lead.responsavel}</Typography>

                  <Box mt={2} display="flex" gap={1}>
                    <Button variant="outlined" color="success" href={`https://wa.me/${formatPhone(lead.whatsapp || lead.telefone)}?text=${encodeURIComponent(`Olá ${lead.nome}, como posso te ajudar com sua proposta?`)}`} target="_blank">WhatsApp</Button>
                    <Button variant="outlined" href={`https://facebook.com/${lead.usuarioFacebook}`} target="_blank">Facebook</Button>
                    <Button variant="outlined" href={`https://instagram.com/${lead.usuarioInstagram}`} target="_blank">Instagram</Button>
                  </Box>

                  <Box mt={4}>
                    <Tabs
                      value={abaSelecionada}
                      onChange={(e, novaAba) => setAbaSelecionadaPorLead(prev => ({ ...prev, [lead.id]: novaAba }))}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="📄 Propostas" />
                      <Tab label="📮 Reclamações" />
                      <Tab label="🎯 Preferências" />
                      <Tab label="📌 Ações Futuras" />
                      <Tab label="🧭 Fluxo Comercial" />
                    </Tabs>

                    <Box mt={2}>
                      {renderConteudoAba(lead.id, abaSelecionada, fasesDoLead, diasSemAcoes)}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LeadsDashboard;