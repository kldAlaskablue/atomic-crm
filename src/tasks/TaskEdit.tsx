import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid
} from '@mui/material';
import { useState, useEffect } from 'react';
import { dataProvider } from '../providers/supabase';

type Task = {
  id: string;
  nomecompleto: string;
  telefone?: string;
  email?: string;
  empresa?: string;
  due_date: string;
  observacao_vendedor?: string;
};

type TaskEditProps = {
  open: boolean;
  close: () => void;
  taskId: string;
  selectedData?: Task | null;
  onSaved: () => void;
};

export function TaskEdit({
  open,
  close,
  selectedData,
  taskId,
  onSaved
}: TaskEditProps) {
  const [form, setForm] = useState<Task | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (selectedData) {
      setForm({
        id: selectedData.id,
        nomecompleto: selectedData.nomecompleto ?? '',
        telefone: selectedData.telefone ?? '',
        email: selectedData.email ?? '',
        empresa: selectedData.empresa ?? '',
        due_date: selectedData.due_date.slice(0, 16),
        observacao_vendedor: selectedData.observacao_vendedor ?? '',
      });
    } else {
      setForm(null);
    }
  }, [selectedData]);

  const handleChange = (field: keyof Task) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => prev ? { ...prev, [field]: e.target.value } : prev);
  };

  const handleSave = async () => {
    if (!form || salvando) return;

    setSalvando(true);
    console.log('🔄 Atualizando tarefa:', form);

    try {
      const { id, ...rest } = form;

      await dataProvider.update('tasks', {
        id: form.id,
        data: {
          contact_name: form.nomecompleto,
          telefone: form.telefone,
          email: form.email,
          empresa: form.empresa,
          due_date: form.due_date,
          observacao_vendedor: form.observacao_vendedor,
        },
        previousData: selectedData!,
      });

      console.log('✅ Tarefa atualizada com sucesso');
      onSaved();
      close();
    } catch (err) {
      console.error('❌ Erro ao atualizar tarefa:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open && !!form} onClose={close} fullWidth maxWidth="sm">
      <DialogTitle>✏️ Editar Tarefa</DialogTitle>
      <DialogContent>
        {form ? (
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <TextField
                label="Nome completo"
                value={form.nomecompleto}
                onChange={handleChange('nomecompleto')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Telefone"
                value={form.telefone}
                onChange={handleChange('telefone')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="E-mail"
                value={form.email}
                onChange={handleChange('email')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Empresa"
                value={form.empresa}
                onChange={handleChange('empresa')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Data limite"
                type="datetime-local"
                value={form.due_date}
                onChange={handleChange('due_date')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Observação do vendedor"
                multiline
                minRows={3}
                value={form.observacao_vendedor}
                onChange={handleChange('observacao_vendedor')}
                fullWidth
              />
            </Grid>
          </Grid>
        ) : (
          <p>⏳ Carregando dados da tarefa...</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Cancelar</Button>
        <Button
          onClick={handleSave}
          disabled={!form || salvando}
          variant="contained"
        >
          {salvando ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
