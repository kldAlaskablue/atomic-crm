import { useEffect, useState } from 'react';
import { supabase } from '../providers/supabase/supabase';
import { getSaleFromCache } from '../providers/supabase/authProvider';

export interface UsuarioLogado {
  id: string;
  fullName: string;
  avatar?: string;
  administrator?: boolean;
}

export const useUsuarioLogadoInfo = () => {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {     
      const userId = data?.session?.user?.id;
      if (!userId) {
        setUsuario(null);
        return;
      }
      getSaleFromCache().then((sale) => {
        if (sale?.id === userId) {
          
          setUsuario({
            id: sale.id,
            fullName: `${sale.first_name} ${sale.last_name}`,
            avatar: sale.avatar?.src,
            administrator: sale.administrator,
          });
        } else {
          setUsuario(null); // ✅ identidade inconsistente
        }
      });
    });
  }, []);

  return usuario;
};