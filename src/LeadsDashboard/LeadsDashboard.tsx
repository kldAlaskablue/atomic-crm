import {
  Box, Card, CardContent, Typography, Button, Grid, Tabs, Tab, Divider
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
  const [abaSelecionadaPorLead, setAbaSelecionadaPorLead] = useState<Record<string, number>>({});

  useEffect(() => {
    dataProvider.getList('leads', {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'nome', order: 'ASC' },
      filter: {},
    }).then(res => setLeads(res.data as Lead[]));

    dataProvider.getList('evolucao_lead', {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: 'data', order: 'ASC' },
      filter: {},
    }).then(res => setFases(res.data as EvolucaoLead[]));
  }, []);

  const handleChangeAba = (leadId: string, novaAba: number) => {
    setAbaSelecionadaPorLead(prev => ({
      ...prev,
      [leadId]: novaAba
    }));
  };

  const formatPhone = (tel?: string) => {
    if (!tel) return '';
    return tel.replace(/\D/g, '');
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>📣 Painel Estratégico de Leads</Typography>

      <Grid container spacing={3}>
        {leads.map((lead) => {
          const fasesDoLead = fases.filter(f => f.lead_id === lead.id);
          const ultimaFase = fasesDoLead[fasesDoLead.length - 1];
          const diasSemAcoes = ultimaFase
            ? dayjs().diff(dayjs(ultimaFase.data), 'day')
            : null;

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
                    <Button
                      variant="outlined"
                      color="success"
                      href={`https://wa.me/${formatPhone(lead.whatsapp || lead.telefone)}?text=${encodeURIComponent(`Olá ${lead.nome}, como posso te ajudar com sua proposta?`)}`}
                      target="_blank"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      variant="outlined"
                      href={`https://facebook.com/${lead.usuarioFacebook}`}
                      target="_blank"
                    >
                      Facebook
                    </Button>
                    <Button
                      variant="outlined"
                      href={`https://instagram.com/${lead.usuarioInstagram}`}
                      target="_blank"
                    >
                      Instagram
                    </Button>
                  </Box>

                  <Box mt={4}>
                    <Tabs
                      value={abaSelecionadaPorLead[lead.id] ?? 0}
                      onChange={(e, novaAba) => handleChangeAba(lead.id, novaAba)}
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
                      {(abaSelecionadaPorLead[lead.id] ?? 0) === 0 && (
                        <CardProposta
                          valor={12000}
                          dataEnvio="10/07"
                          validade="20/07"
                          status="pendente"
                          responsavel="Carlos Mendes"
                        />
                      )}

                      {(abaSelecionadaPorLead[lead.id] ?? 0) === 1 && (
                        <CardReclamacao
                          tipo="Reclamação"
                          data="05/07"
                          assunto="Produto com defeito"
                          status="resolvido"
                          acaoTomada="Troca realizada em 24h"
                          feedback="Cliente elogiou atendimento"
                        />
                      )}

                      {(abaSelecionadaPorLead[lead.id] ?? 0) === 2 && (
                        <CardPreferencias
                          interesse="Linha premium"
                          comunicacao="WhatsApp"
                          segmento="Alimentos"
                          porte="Grande"
                        />
                      )}

                      {(abaSelecionadaPorLead[lead.id] ?? 0) === 3 && (
                        <CardAcoesFuturas
                          descricao="Agendar reunião até 25/07"
                          responsavel="Paulo"
                          prioridade="Alta"
                        />
                      )}

                      {(abaSelecionadaPorLead[lead.id] ?? 0) === 4 && (
                        <>
                          <LeadFluxo
                            fases={fasesDoLead.map(f => ({
                              fase: f.fase,
                              data: f.data,
                              anotacao: f.anotacao
                            }))}
                            mensagens={[
                              'Olá, estou interessado na linha premium.',
                              'Pode enviar valores e condições?',
                              'Recebi a proposta, obrigado!'
                            ]}
                            leadId={lead.id}
                            onNovaFase={() => {
                              dataProvider.getList('evolucao_lead', {
                                pagination: { page: 1, perPage: 1000 },
                                sort: { field: 'data', order: 'ASC' },
                                filter: {},
                              }).then(res => setFases(res.data));
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
                                href={`https://wa.me/${formatPhone(lead.telefone)}?text=${encodeURIComponent(`Olá ${lead.nome}, seguimos disponíveis para apoiar você com sua proposta. Precisa de algo mais?`)}`}
                                target="_blank"
                              >
                                📬 Enviar Follow-up
                              </Button>
                            </Box>
                          )}
                        </>
                      )}
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