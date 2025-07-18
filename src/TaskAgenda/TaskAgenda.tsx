import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Stack,
    Tabs,
    Tab,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { JSX, useEffect, useState } from 'react';
import { dataProvider } from '../providers/supabase';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import SearchIcon from '@mui/icons-material/Search';
import GroupsIcon from '@mui/icons-material/Groups';
import {TaskEdit} from '../tasks/TaskEdit';

type Task = {
    id: string;
    task_type: string;
    time?: string;
    contact_name?: string;
    assigned_to_name?: string;
    due_date: string;
};

const diasFixos = [
    'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira',
    'sexta-feira', 'sábado', 'domingo'
];

export const TaskAgenda = () => {
    const [tasksByDay, setTasksByDay] = useState<{ [day: string]: Task[] }>({});
    const [selectedDay, setSelectedDay] = useState<string>('segunda-feira');
    const [editOpen, setEditOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string>('');
    const [taskHistory, setTaskHistory] = useState<any[]>([]);

    const fetchTasks = () => {
        dataProvider.getList('tasks', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: {},
        }).then((response) => {
            const grouped: { [day: string]: Task[] } = {};
            response.data.forEach((task: Task) => {
                const date = new Date(task.due_date).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                });
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(task);
            });

            setTasksByDay(grouped);
            const diaInicial = diasFixos.find((d) => grouped[d]);
            if (diaInicial) setSelectedDay(diaInicial);
        });
    };

    const fetchTaskHistory = () => {
        dataProvider.getList('task_history', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'reagendado_em', order: 'DESC' },
            filter: {},
        }).then((response) => {
            setTaskHistory(response.data);
        });
    };

    useEffect(() => {
        fetchTasks();
        fetchTaskHistory();
    }, []);

    const colorByType: Record<string, string> = {
        Ligação: '#1976d2',
        WhatsApp: '#2e7d32',
        'Envio de documentos': '#ed6c02',
        'Consulta de crédito': '#0288d1',
        Reunião: '#d32f2f',
    };

    const iconByType: Record<string, JSX.Element> = {
        Ligação: <PhoneIcon fontSize="small" />,
        WhatsApp: <WhatsAppIcon fontSize="small" />,
        'Envio de documentos': <DocumentScannerIcon fontSize="small" />,
        'Consulta de crédito': <SearchIcon fontSize="small" />,
        Reunião: <GroupsIcon fontSize="small" />,
    };

    const diasSemanaOrdenados = diasFixos.filter((d) => tasksByDay[d]);

    return (
        <Box mt={5}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                🗓️ Agenda da Semana
            </Typography>

            <Tabs
                value={selectedDay}
                onChange={(e, val) => setSelectedDay(val)}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                sx={{ mb: 3 }}
            >
                {diasSemanaOrdenados.map((day) => (
                    <Tab key={day} label={day.charAt(0).toUpperCase() + day.slice(1)} value={day} />
                ))}
            </Tabs>

            <Grid container spacing={3}>
                {tasksByDay[selectedDay]?.map((task, idx) => {
                    const cor = colorByType[task.task_type] ?? '#616161';
                    const icon = iconByType[task.task_type];

                    return (
                        <Grid item xs={12} md={6} lg={4} key={idx}>
                            <Card
                                elevation={3}
                                sx={{
                                    borderRadius: 3,
                                    transition: '0.3s',
                                    '&:hover': {
                                        boxShadow: 6,
                                        transform: 'scale(1.015)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar sx={{ bgcolor: cor }} variant="rounded">
                                            {icon}
                                        </Avatar>

                                        <Box flex={1}>
                                            <Typography variant="body1" fontWeight="medium">
                                                {task.task_type} – {task.time ?? 'Sem hora'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {task.contact_name ?? 'Contato não especificado'}<br />
                                                {task.assigned_to_name ?? 'Responsável não definido'}
                                            </Typography>
                                        </Box>

                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => {
                                                setSelectedTaskId(task.id);
                                                setEditOpen(true);
                                            }}
                                        >
                                            Reagendar
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Histórico */}
            <Divider sx={{ mt: 5, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
                📜 Histórico de Reagendamentos
            </Typography>

            <Grid container spacing={3}>
                {taskHistory.map((history, idx) => (
                    <Grid item xs={12} md={6} lg={4} key={idx}>
                        <Card elevation={1} sx={{ borderRadius: 2, bgcolor: '#f5f5f5' }}>
                            <CardContent>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Reagendado em: {new Date(history.reagendado_em).toLocaleString()}
                                </Typography>
                                <Typography variant="body1">
                                    {history.task_type} – {history.time ?? 'Sem hora'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Cliente: {history.contact_name ?? 'Não informado'}<br />
                                    Responsável: {history.assigned_to_name ?? 'Indefinido'}<br />
                                    Data original: {new Date(history.due_date).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Popup de reagendamento */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>📅 Reagendar Tarefa</DialogTitle>
                <TaskEdit
                    open={true}
                    close={() => setEditOpen(false)}
                    taskId={selectedTaskId}
                    onSaved={() => {
                        fetchTasks();
                        fetchTaskHistory();
                    }}
                />
            </Dialog>
        </Box>
    );
};

export default TaskAgenda;
