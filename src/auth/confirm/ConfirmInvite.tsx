import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../providers/supabase/supabase';
import { Typography, CircularProgress, Container } from '@mui/material';

export default function ConfirmInvite() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Confirmando...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token_hash');
    const type = params.get('type');
    const redirectTo = params.get('redirect_to') || '/';

    if (token && type === 'invite') {
      supabase.auth.verifyOtp({ token_hash: token, type: 'invite' }).then(({ error }) => {
        if (error) {
          console.error('Erro:', error.message);
          setStatus('Erro ao confirmar o convite. Tente novamente ou peça um novo link.');
        } else {
          setStatus('Convite confirmado! Redirecionando...');
          setTimeout(() => navigate(redirectTo), 2000);
        }
      });
    } else {
      setStatus('Parâmetros inválidos na URL.');
    }
  }, [location]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        {status}
      </Typography>
      {status === 'Confirmando...' && <CircularProgress />}
    </Container>
  );
}
