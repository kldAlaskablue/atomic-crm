import {
  Box, Typography, Divider, Select, MenuItem, TextField, Button,
  FormControl, InputLabel
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { dataProvider } from '../providers/supabase';

interface Fase {
  fase: string;
  data: string;
  anotacao?: string;
}

interface LeadFluxoProps {
  fases: Fase[];
  mensagens?: string[];
  leadId: string;
  onNovaFase?: () => void;
}

const LeadFluxo = ({ fases, mensagens, leadId, onNovaFase }: LeadFluxoProps) => {
  const [faseSelecionada, setFaseSelecionada] = useState('');
  const [anotacao, setAnotacao] = useState('');
  const [salvando, setSalvando] = useState(false);

  const salvarFase = async () => {
    if (!faseSelecionada) return alert('Selecione uma fase!');
    setSalvando(true);
    try {
      await dataProvider.create('evolucao_lead', {
        data: {
          lead_id: leadId,
          fase: faseSelecionada,
          data: new Date().toISOString(),
          anotacao
        }
      });
      setFaseSelecionada('');
      setAnotacao('');
      onNovaFase?.(); // Recarrega as fases no painel pai
    } catch (err) {
      alert('Erro ao salvar fase');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold">🧭 Jornada do Lead</Typography>
      {fases.map((fase, index) => (
        <Box key={index} mb={1}>
          <Typography variant="body2">🟢 {fase.fase} – {dayjs(fase.data).format('DD/MM')}</Typography>
          {fase.anotacao && (
            <Typography variant="body2" sx={{ pl: 2 }}>🗒️ {fase.anotacao}</Typography>
          )}
        </Box>
      ))}
      <Divider sx={{ my: 1 }} />
      {mensagens && (
        <>
          <Typography variant="subtitle2">💬 Mensagens via WhatsApp</Typography>
          {mensagens.map((msg, i) => (
            <Typography key={i} variant="body2" sx={{ pl: 2 }}>🗨️ {msg}</Typography>
          ))}
        </>
      )}

      {/* ➕ Formulário para registrar nova fase */}
      <Box mt={3}>
        <Typography variant="subtitle2" fontWeight="bold">➕ Registrar nova fase</Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Fase</InputLabel>
          <Select
            value={faseSelecionada}
            label="Fase"
            onChange={(e) => setFaseSelecionada(e.target.value)}
          >
            <MenuItem value="Qualificação">Qualificação</MenuItem>
            <MenuItem value="Proposta enviada">Proposta enviada</MenuItem>
            <MenuItem value="Negociação">Negociação</MenuItem>
            <MenuItem value="Fechado">Fechado</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Anotação"
          fullWidth
          multiline
          value={anotacao}
          onChange={(e) => setAnotacao(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" onClick={salvarFase} disabled={salvando}>
          {salvando ? 'Salvando...' : '💾 Salvar fase'}
        </Button>
      </Box>
      
    </Box>
  );
};

export default LeadFluxo;