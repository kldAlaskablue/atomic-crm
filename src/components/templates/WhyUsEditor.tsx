// src/components/templates/WhyUsEditor.tsx
import {
  Box,
  TextField,
  Typography,
  IconButton,
  Stack,
  Button,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import { WhyUsSectionDB } from '../data/templatesMock'
import { useState } from 'react'
import { Delete, Add } from '@mui/icons-material'

const WhyUsEditor = ({ tipo }: { tipo: string }) => {
  const initial = WhyUsSectionDB[tipo]
  const [form, setForm] = useState(initial)

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...form.itens ?? []]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setForm({ ...form, itens: updatedItems })
  }

  const handleAddItem = () => {
    const updatedItems = [...form.itens ?? [], { icon: '', text: '' }]
    setForm({ ...form, itens: updatedItems })
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = form.itens?.filter((_, i) => i !== index)
    setForm({ ...form, itens: updatedItems })
  }

  return (
    <Box sx={{ paddingY: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Seção: Por que escolher
      </Typography>

      <TextField
        fullWidth
        label="Título"
        value={form.title}
        onChange={(e) => handleChange('title', e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Subtítulo"
        value={form.subtitle}
        onChange={(e) => handleChange('subtitle', e.target.value)}
        sx={{ mb: 4 }}
      />

      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
        Diferenciais destacados
      </Typography>

      {form.itens?.map((item, index) => (
        <Stack direction="row" spacing={2} alignItems="flex-start" key={index} sx={{ mb: 2 }}>
          <InputLabel id={`icon-label-${index}`}>Ícone</InputLabel>
          <Select
            labelId={`icon-label-${index}`}
            value={item.icon}
            onChange={(e) => handleItemChange(index, 'icon', e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="CheckCircle2">CheckCircle2</MenuItem>
            <MenuItem value="Users">Users</MenuItem>
            <MenuItem value="Briefcase">Briefcase</MenuItem>
            <MenuItem value="BarChart">BarChart</MenuItem>
          </Select>

          <TextField
            label="Texto do diferencial"
            value={item.text}
            onChange={(e) => handleItemChange(index, 'text', e.target.value)}
            fullWidth
          />

          <IconButton onClick={() => handleRemoveItem(index)} color="error">
            <Delete />
          </IconButton>
        </Stack>
      ))}

      <Button variant="outlined" startIcon={<Add />} onClick={handleAddItem}>
        Adicionar diferencial
      </Button>
    </Box>
  )
}

export default WhyUsEditor