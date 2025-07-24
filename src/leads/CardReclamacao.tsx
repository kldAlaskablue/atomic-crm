import { Card, CardContent, Typography } from '@mui/material';

interface CardReclamacaoProps {
  tipo: string;
  data: string;
  assunto: string;
  status: string;
  acaoTomada: string;
  feedback: string;
}

const CardReclamacao = ({
  tipo,
  data,
  assunto,
  status,
  acaoTomada,
  feedback
}: CardReclamacaoProps) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="subtitle1" fontWeight="bold">📮 {tipo}</Typography>
      <Typography variant="body2">📅 {data}</Typography>
      <Typography variant="body2">📝 Assunto: {assunto}</Typography>
      <Typography variant="body2">🔧 Ação tomada: {acaoTomada}</Typography>
      <Typography variant="body2">✅ Status: {status}</Typography>
      <Typography variant="body2">💬 Feedback: {feedback}</Typography>
    </CardContent>
  </Card>
);

export default CardReclamacao;

