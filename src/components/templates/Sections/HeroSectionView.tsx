// src/components/templates/HeroSectionView.tsx
import { Box, Typography, Button, Stack } from '@mui/material'

type HeroProps = {
  data: {
    titulo: string
    subtitulo: string
    subtituloMenor?: string
    layout?: 'center' | 'left' | 'right'
    corFundo?: string
    mostrarBotao?: boolean
    textLinkbotao?: string
    imagemFundo?: string
    imagemdestaque?: string
    showImagemFundo?: boolean
    showImage?: boolean
  }
}

const HeroSectionView = ({ data }: HeroProps) => {
  const {
    titulo,
    subtitulo,
    subtituloMenor,
    corFundo,
    mostrarBotao,
    textLinkbotao,
    imagemFundo,
    imagemdestaque,
    showImagemFundo,
    showImage,
    layout = 'center',
  } = data ?? {}

  return (
    <Box
      sx={{
        background: corFundo || '#f5f5f5',
        backgroundImage: showImagemFundo ? `url(${imagemFundo})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: 6,
        borderRadius: 2,
        color: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: layout === 'left' ? 'row' : layout === 'right' ? 'row-reverse' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        textAlign: layout === 'center' ? 'center' : 'left',
      }}
    >
      <Stack spacing={2} maxWidth={700}>
        <Typography variant="h3" fontWeight={700}>
          {titulo}
        </Typography>

        <Typography variant="body1">{subtitulo}</Typography>

        {subtituloMenor && (
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {subtituloMenor}
          </Typography>
        )}

        {mostrarBotao && (
          <Button
            variant="contained"
            color="primary"
            sx={{ width: 'fit-content', mt: 2 }}
          >
            {textLinkbotao || 'Saiba mais'}
          </Button>
        )}
      </Stack>

      {showImage && imagemdestaque && (
        <Box
          component="img"
          src={imagemdestaque}
          alt="Imagem destaque"
          sx={{
            height: 280,
            width: 'auto',
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
      )}
    </Box>
  )
}

export default HeroSectionView