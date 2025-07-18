import { Box, Divider } from '@mui/material';
import LeadsDashboard from '../LeadsDashboard/LeadsDashboard';
import AgendaSemanal from '../TaskAgenda/AgendaSemanal';

const PainelComercial = () => {
  return (
    <Box sx={{ px: 2, py: 3 }}>
      {/* Painel direto, sem título extra */}
      <LeadsDashboard />

      <Divider sx={{ my: 4 }} />

      <AgendaSemanal />
    </Box>
  );
};

export default PainelComercial;
