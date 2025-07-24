// src/components/templates/HeroEditor.tsx
import { TextField, Switch, FormControlLabel, Box, Select, MenuItem, InputLabel } from '@mui/material'
import { useState } from 'react'
import { HeroSectionDB } from '../data/templatesMock'

const HeroEditor = ({ tipo }: { tipo: string }) => {
  const initial = HeroSectionDB[tipo]
  const [form, setForm] = useState(initial)

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value })
  }

  return (
    <Box sx={{ paddingY: 4 }}>
      <TextField
        fullWidth
        label="Título"
        value={form.titulo}
        onChange={(e) => handleChange('titulo', e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Subtítulo"
        value={form.subtitulo}
        onChange={(e) => handleChange('subtitulo', e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Texto do botão"
        value={form.textLinkbotao}
        onChange={(e) => handleChange('textLinkbotao', e.target.value)}
        sx={{ mb: 2 }}
      />

      <InputLabel id="layout-label">Layout</InputLabel>
      <Select
        labelId="layout-label"
        value={form.layout}
        onChange={(e) => handleChange('layout', e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="center">Centralizado</MenuItem>
        <MenuItem value="left">Alinhado à esquerda</MenuItem>
        <MenuItem value="right">Alinhado à direita</MenuItem>
      </Select>

      <TextField
        fullWidth
        label="Cor de fundo"
        value={form.corFundo}
        onChange={(e) => handleChange('corFundo', e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Imagem de fundo (URL)"
        value={form.ImagemFundo}
        onChange={(e) => handleChange('ImagemFundo', e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Imagem destaque (URL)"
        value={form.Imagemdestaque}
        onChange={(e) => handleChange('Imagemdestaque', e.target.value)}
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={form.mostrarBotao}
            onChange={(e) => handleChange('mostrarBotao', e.target.checked)}
          />
        }
        label="Mostrar botão?"
        sx={{ mb: 1 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={form.mostrarLink}
            onChange={(e) => handleChange('mostrarLink', e.target.checked)}
          />
        }
        label="Mostrar link?"
        sx={{ mb: 1 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={form.showImage}
            onChange={(e) => handleChange('showImage', e.target.checked)}
          />
        }
        label="Mostrar imagem destaque?"
        sx={{ mb: 1 }}
      />

      <FormControlLabel
        control={
          <Switch
            checked={form.showImagemFundo}
            onChange={(e) => handleChange('showImagemFundo', e.target.checked)}
          />
        }
        label="Usar imagem de fundo?"
        sx={{ mb: 1 }}
      />
    </Box>
  )
}

export default HeroEditor