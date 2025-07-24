import { Card, CardContent, Typography } from '@mui/material';

interface CardPreferenciasProps {
  interesse: string;
  comunicacao: string;
  segmento: string;
  porte: string;
}

const CardPreferencias = ({
  interesse,
  comunicacao,
  segmento,
  porte
}: CardPreferenciasProps) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight="bold">🎯 Preferências e Interesses</Typography>
      <Typography variant="body2">💡 Interesse: {interesse}</Typography>
      <Typography variant="body2">📡 Comunicação preferida: {comunicacao}</Typography>
      <Typography variant="body2">🌐 Segmento: {segmento}</Typography>
      <Typography variant="body2">🏢 Porte: {porte}</Typography>
    </CardContent>
  </Card>
);

export default CardPreferencias;

