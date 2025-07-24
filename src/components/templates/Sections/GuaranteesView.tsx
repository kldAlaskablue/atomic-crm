// src/components/templates/GuaranteesView.tsx
import { Box, Typography, Grid, Paper, Stack } from '@mui/material'

type GuaranteeItem = {
  icon: string
  name: string
}

type GuaranteesProps = {
  data: {
    titulo: string
    subtitulo: string
    itens?: GuaranteeItem[]
  }
}

const GuaranteesView = ({ data }: GuaranteesProps) => {
  const { titulo, subtitulo, itens = [] } = data

  return (
    <Box sx={{ paddingY: 6 }}>
      <Typography variant="h4" fontWeight={600}>
        {titulo || 'Garantias aceitas'}
      </Typography>

      {subtitulo && (
        <Typography variant="body1" color="text.secondary" mb={4}>
          {subtitulo}
        </Typography>
      )}

      <Grid container spacing={3}>
        {itens.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={2} sx={{ padding: 3 }}>
              <Stack spacing={1} alignItems="center">
                <Typography fontSize={32}>{item.icon}</Typography>
                <Typography variant="body2" textAlign="center">
                  {item.name}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default GuaranteesView