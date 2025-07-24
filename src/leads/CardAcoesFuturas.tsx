import { Card, CardContent, Typography } from '@mui/material';

interface CardAcoesFuturasProps {
  descricao: string;
  responsavel: string;
  prioridade?: string;
}

const CardAcoesFuturas = ({
  descricao,
  responsavel,
  prioridade
}: CardAcoesFuturasProps) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight="bold">📌 Ações Futuras</Typography>
      <Typography variant="body2">📆 Descrição: {descricao}</Typography>
      <Typography variant="body2">👤 Responsável: {responsavel}</Typography>
      {prioridade && (
        <Typography variant="body2">📝 Prioridade: {prioridade}</Typography>
      )}
    </CardContent>
  </Card>
);

export default CardAcoesFuturas;

