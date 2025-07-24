// src/components/templates/AboutSectionView.tsx
import { Box, Typography, Stack, Card, CardContent } from '@mui/material'

type AboutItem = {
  title: string
  description: string
}

type AboutProps = {
  data: {
    title: string
    description: string
    itens?: AboutItem[]
  }
}

const AboutSectionView = ({ data }: AboutProps) => {
  const { title, description, itens = [] } = data

  return (
    <Box sx={{ paddingY: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={4} maxWidth={700}>
        {description}
      </Typography>

      <Stack spacing={2}>
        {itens.map((item, index) => (
          <Card key={index} elevation={1}>
            <CardContent>
              <Typography variant="h6" fontWeight={500}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}

export default AboutSectionView