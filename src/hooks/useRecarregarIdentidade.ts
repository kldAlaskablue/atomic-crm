// src/hooks/useRecarregarIdentidade.ts
import { useState } from 'react';
import { getSaleFromCache } from '../providers/supabase/authProvider';

export const useRecarregarIdentidade = () => {
  const [usuario, setUsuario] = useState<any>(null);

  const recarregar = async () => {
    const sale = await getSaleFromCache();
    if (sale) {
      setUsuario({
        id: sale.id,
        fullName: `${sale.first_name} ${sale.last_name}`,
        avatar: sale.avatar?.src,
        administrator: sale.administrator,
      });
    }
  };

  return { usuario, recarregar };
};