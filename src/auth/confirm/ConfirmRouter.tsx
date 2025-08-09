import { useLocation } from 'react-router-dom';
import ConfirmInvite from './ConfirmInvite';
import ConfirmEmail from './ConfirmEmail';

export default function ConfirmRouter() {
  const params = new URLSearchParams(useLocation().search);
  const type = params.get('type');

  if (type === 'invite') return <ConfirmInvite />;
  if (type === 'email') return <ConfirmEmail />;
  return <div>Tipo de confirmação inválido.</div>;
}
