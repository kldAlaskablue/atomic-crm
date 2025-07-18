import {
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    CircularProgress,
    Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { dataProvider } from '../providers/supabase';

type TaskEditProps = {
    open: boolean;
    close: () => void;
    taskId: string;
    onSaved?: () => void;
};

export const TaskEdit = ({ open, close, taskId, onSaved }: TaskEditProps) => {
    const [time, setTime] = useState('');
    const [due_date, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [originalTask, setOriginalTask] = useState<any>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (taskId) {
            setFetching(true);
            dataProvider
                .getOne('tasks', { id: taskId })
                .then((res) => {
                    const task = res.data;
                    setTime(task.time || '');
                    setDueDate(task.due_date?.slice(0, 10) || '');
                    setOriginalTask(task);
                })
                .finally(() => {
                    setFetching(false);
                });
        }
    }, [taskId]);

    const handleSave = async () => {
        if (!originalTask) return;

        setLoading(true);
        try {
            // Salvar histórico da tarefa anterior
            await dataProvider.create('task_history', {
                data: {
                    task_id_original: originalTask.id,
                    task_type: originalTask.task_type,
                    contact_name: originalTask.contact_name,
                    assigned_to_name: originalTask.assigned_to_name,
                    time: originalTask.time,
                    due_date: originalTask.due_date,
                    status: 'Reagendado',
                    reagendado_em: new Date().toISOString(),
                },
            });

            // Criar nova tarefa com as novas datas
            await dataProvider.create('tasks', {
                data: {
                    contact_name: originalTask.contact_name,
                    task_type: originalTask.task_type,
                    assigned_to_name: originalTask.assigned_to_name,
                    due_date: `${due_date}T${time}`, // ❌ erro comum
                    status: 'Reagendado',
                },
            });

            close();
            onSaved?.();
        } catch (err) {
            console.error('Erro ao reagendar tarefa:', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching || !originalTask) {
        return (
            <DialogContent>
                <CircularProgress />
            </DialogContent>
        );
    }

    return (
        <>
            <DialogTitle
                sx={{
                    mb: '1rem', // 👈 aqui é o margin-bottom com 2rem
                    wordBreak: 'break-word',
                }}
            >

            </DialogTitle>
            <br />

            <DialogContent>
                <Stack spacing={3} >
                    <TextField
                        label="Nome do cliente"
                        value={originalTask.contact_name}
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Horário"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Data"
                        type="date"
                        value={due_date}
                        onChange={(e) => setDueDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />

                    <Stack direction="row" spacing={2}>
                        <Button variant="outlined" onClick={close} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button variant="contained" onClick={handleSave} disabled={loading}>
                            {loading ? <CircularProgress size={20} /> : 'Salvar Novo Agendamento'}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </>
    );
};
