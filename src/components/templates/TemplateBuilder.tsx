// src/components/templates/TemplateBuilder.tsx
import { useState } from 'react'
import { Box, Grid, Select, MenuItem, Typography, Button } from '@mui/material'
import TemplateEditor from './TemplateEditor'
import TemplatePreview from './TemplatePreview'
type TemplateBuilderProps = {
  tipo: string
}


const TemplateBuilder = ({ tipo }: TemplateBuilderProps) => {
  const [tipoSelecionado, setTipoSelecionado] = useState(tipo);

  const handleSave = () => {
    // Por enquanto apenas simulado
    console.log('Alterações salvas para:', tipo)
    alert(`Template "${tipo}" salvo com sucesso!`)
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Construtor de Templates
      </Typography>

      <Select
        value={tipo}
        onChange={(e) => setTipoSelecionado(e.target.value)}
        sx={{ mb: 4 }}
      >
        <MenuItem value="capitalgiro">Capital de Giro</MenuItem>
        <MenuItem value="imoveis">Imóveis</MenuItem>
        <MenuItem value="agronegocio">Agronegócio</MenuItem>
      </Select>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            ✏️ Editar seções
          </Typography>
          <TemplateEditor tipo={tipo} />
          <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 4 }}>
            Salvar alterações
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={500} gutterBottom>
            👁️ Visualização em tempo real
          </Typography>
          <TemplatePreview tipo={tipo} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TemplateBuilder