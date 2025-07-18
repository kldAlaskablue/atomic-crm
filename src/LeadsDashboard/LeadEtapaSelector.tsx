import { Select, MenuItem, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { dataProvider } from '../providers/supabase';

type Props = {
  leadId: string;
  currentEtapa: string;
  onUpdated?: () => void;
};

const etapas = [
  'novo',
  'qualificado',
  'reunião agendada',
  'proposta enviada',
  'negócio fechado',
  'perdido',
];

const LeadEtapaSelector = ({ leadId, currentEtapa, onUpdated }: Props) => {
  const [etapa, setEtapa] = useState(currentEtapa);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: any) => {
    const novaEtapa = e.target.value;
    setEtapa(novaEtapa);
    setLoading(true);

    try {
      await dataProvider.update('leads', {
        id: leadId,
        data: { etapa: novaEtapa },
        previousData: { etapa },
      });
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Erro ao atualizar etapa:', err);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <CircularProgress size={20} />
  ) : (
    <Select value={etapa} onChange={handleChange} size="small" fullWidth>
      {etapas.map((et) => (
        <MenuItem key={et} value={et}>{et}</MenuItem>
      ))}
    </Select>
  );
};

export default LeadEtapaSelector;
