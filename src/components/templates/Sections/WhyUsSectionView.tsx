// src/components/templates/WhyUsSectionView.tsx
import { Box, Typography, Stack } from '@mui/material'
import { CheckCircle2 } from 'lucide-react'

type WhyUsItem = {
  icon: string
  text: string
}

type WhyUsProps = {
  data: {
    title: string
    subtitle: string
    itens?: WhyUsItem[]
  }
}

const WhyUsSectionView = ({ data }: WhyUsProps) => {
  const { title, subtitle, itens = [] } = data

  return (
    <Box sx={{ paddingY: 6 }}>
      <Typography variant="h4" fontWeight={600}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        {subtitle}
      </Typography>

      <Stack spacing={2}>
        {itens.map((item, index) => (
          <Stack direction="row" spacing={2} alignItems="center" key={index}>
            <CheckCircle2 size={24} color="#1976d2" />
            <Typography variant="body2">{item.text}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

export default WhyUsSectionView