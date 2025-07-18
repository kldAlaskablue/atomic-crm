import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import {Dashboard} from './Dashboard';
import PainelComercial from '../PainelComercial/PainelComercial';

const DashboardExpandido = () => {
  const [abaAtual, setAbaAtual] = useState(0);

  return (
    <Box sx={{ px: 3, pt: 4 }}>
      <Tabs
        value={abaAtual}
        onChange={(e, novaAba) => setAbaAtual(novaAba)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="📊 Visão Estratégica" />
        <Tab label="🧠 Equipe Comercial" />
      </Tabs>

      {abaAtual === 0 && <Dashboard />}
      {abaAtual === 1 && <PainelComercial />}
    </Box>
  );
};

export default DashboardExpandido;
