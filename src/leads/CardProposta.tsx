import { Card, CardContent, Typography } from '@mui/material';

interface CardPropostaProps {
  valor: number;
  dataEnvio: string;
  validade: string;
  status: string;
  responsavel: string;
}

const CardProposta = ({
  valor,
  dataEnvio,
  validade,
  status,
  responsavel
}: CardPropostaProps) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight="bold">📄 Proposta Comercial</Typography>
      <Typography variant="body2">💰 Valor: R$ {valor.toLocaleString()}</Typography>
      <Typography variant="body2">📅 Enviada: {dataEnvio} | Validade: {validade}</Typography>
      <Typography variant="body2">⚙️ Status: {status}</Typography>
      <Typography variant="body2">👤 Responsável: {responsavel}</Typography>
    </CardContent>
  </Card>
);

export default CardProposta;