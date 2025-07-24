// src/components/templates/AboutEditor.tsx
import { Box, TextField, Typography, IconButton, Stack, Button } from '@mui/material'
import { AboutSectionDB } from '../data/templatesMock'
import { useState } from 'react'
import { Delete, Add } from '@mui/icons-material'

const AboutEditor = ({ tipo }: { tipo: string }) => {
  const initial = AboutSectionDB[tipo]
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
    const updatedItems = [...form.itens ?? [], { title: '', description: '' }]
    setForm({ ...form, itens: updatedItems })
  }

  const handleRemoveItem = (index: number) => {
    const updatedItems = form.itens?.filter((_, i) => i !== index)
    setForm({ ...form, itens: updatedItems })
  }

  return (
    <Box sx={{ paddingY: 4 }}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Seção: About
      </Typography>

      <TextField
        fullWidth
        label="Título da seção"
        value={form.title}
        onChange={(e) => handleChange('title', e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Descrição geral"
        value={form.description}
        onChange={(e) => handleChange('description', e.target.value)}
        multiline
        rows={3}
        sx={{ mb: 4 }}
      />

      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
        Itens informativos
      </Typography>

      {form.itens?.map((item, index) => (
        <Stack direction="row" spacing={2} alignItems="flex-start" key={index} sx={{ mb: 2 }}>
          <TextField
            label="Título"
            value={item.title}
            onChange={(e) => handleItemChange(index, 'title', e.target.value)}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={item.description}
            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
            fullWidth
          />
          <IconButton onClick={() => handleRemoveItem(index)} color="error">
            <Delete />
          </IconButton>
        </Stack>
      ))}

      <Button variant="outlined" startIcon={<Add />} onClick={handleAddItem}>
        Adicionar item
      </Button>
    </Box>
  )
}

export default AboutEditor