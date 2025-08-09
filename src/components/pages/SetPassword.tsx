import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../providers/supabase/supabase';

const styles = {
  container: {
    maxWidth: 400,
    margin: '40px auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    fontFamily: 'sans-serif',
    backgroundColor: '#f9f9f9',
  },
  title: {
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '1rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #bbb',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
  success: {
    color: 'green',
    marginTop: '1rem',
  },
};

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [success, setSuccess] = useState(false);

  

  useEffect(() => {
    const handleAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (type !== 'recovery') {
        navigate('/login');
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Erro ao autenticar:', error.message);
          setAuthError('Não foi possível autenticar. Tente novamente.');
        }
      } else {
        setAuthError('Tokens de recuperação ausentes na URL.');
      }
    };

    handleAuth();
  }, [navigate]);

  const handleResetPassword = async () => {
    setLoading(true);
    setUpdateError('');
    setSuccess(false);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setUpdateError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2>🔐 Redefinir sua senha</h2>

      {authError && <p style={styles.error}>{authError}</p>}

      {!authError && (
        <>
          <input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleResetPassword} disabled={loading || !newPassword} style={styles.button}>
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>

          {updateError && <p style={styles.error}>{updateError}</p>}
          {success && <p style={styles.success}>✅ Senha atualizada com sucesso!</p>}
        </>
      )}
    </div>
  );
}
