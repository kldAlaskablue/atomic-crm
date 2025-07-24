// src/components/templates/TemplateEditor.tsx
import { Box, Typography, Divider } from '@mui/material'

import HeroEditor from './HeroEditor'
import AboutEditor from './AboutEditor'
import BenefitsEditor from './BenefitsEditor'
import WhyUsEditor from './WhyUsEditor'
import GuaranteesEditor from './GuaranteesEditor'

const TemplateEditor = ({ tipo }: { tipo: string }) => {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Painel de Edição – Template: {tipo}
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <HeroEditor tipo={tipo} />
      <Divider sx={{ my: 4 }} />

      <AboutEditor tipo={tipo} />
      <Divider sx={{ my: 4 }} />

      <BenefitsEditor tipo={tipo} />
      <Divider sx={{ my: 4 }} />

      <WhyUsEditor tipo={tipo} />
      <Divider sx={{ my: 4 }} />

      <GuaranteesEditor tipo={tipo} />
    </Box>
  )
}

export default TemplateEditor