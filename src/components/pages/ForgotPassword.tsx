// pages/ForgotPassword.tsx
import { useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { supabase } from '../../providers/supabase/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://admin.alaskablue.biz/set-password',
    });

    setStatus(
      error
        ? 'Erro ao enviar e-mail. Tente novamente.'
        : 'E-mail de recuperação enviado com sucesso!'
    );
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Recuperar Senha
      </Typography>
      <TextField
        fullWidth
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" fullWidth onClick={handleSend}>
        Enviar E-mail
      </Button>
      <Typography sx={{ mt: 2 }}>{status}</Typography>
    </Container>
  );
}
