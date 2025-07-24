// src/components/templates/BenefitsSectionView.tsx
import { Box, Typography, Grid, Paper, Stack } from '@mui/material'
import { ReactElement } from 'react'
import { BarChart, Users, CheckCircle2, Briefcase } from 'lucide-react'

type BenefitItem = {
  icon: string
  text: string
}

type BenefitsProps = {
  data: {
    title: string
    subtitle: string
    itens?: BenefitItem[]
  }
}

const iconMap: Record<string, ReactElement> = {
  BarChart: <BarChart size={32} />,
  Users: <Users size={32} />,
  CheckCircle2: <CheckCircle2 size={32} />,
  Briefcase: <Briefcase size={32} />,
}

const BenefitsSectionView = ({ data }: BenefitsProps) => {
  const { title, subtitle, itens = [] } = data

  return (
    <Box sx={{ paddingY: 6 }}>
      <Typography variant="h4" fontWeight={600}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4}>
        {subtitle}
      </Typography>

      <Grid container spacing={3}>
        {itens.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={2} sx={{ padding: 3, height: '100%' }}>
              <Stack spacing={2} alignItems="center">
                {iconMap[item.icon] || <Box />}
                <Typography
                  variant="body2"
                  color="text.primary"
                  textAlign="center"
                >
                  {item.text}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default BenefitsSectionView