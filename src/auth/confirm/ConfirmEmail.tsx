import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../providers/supabase/supabase';

export default function ConfirmEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token_hash');
    const type = params.get('type');
    const redirectTo = params.get('redirect_to') || '/';

    if (token && type === 'email') {
      supabase.auth.verifyOtp({ token_hash: token, type: 'email' }).then(({ error }) => {
        if (error) {
          console.error('Erro ao confirmar e-mail:', error.message);
          navigate('/error');
        } else {
          navigate(redirectTo);
        }
      });
    }
  }, [location]);

  return <p>Confirmando e-mail...</p>;
}
