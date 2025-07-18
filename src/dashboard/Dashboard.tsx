import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Avatar,
    useTheme,
} from '@mui/material';
import ContactIcon from '@mui/icons-material/Person';
import DealsIcon from '@mui/icons-material/Handshake';
import TasksIcon from '@mui/icons-material/Task';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { useEffect, useState } from 'react';
import { dataProvider } from '../providers/supabase';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import TaskAgenda from '../TaskAgenda/TaskAgenda';

interface DealStageData {
  date: string;
  [stage: string]: number | string;
}





// interface DealStageData {
//     date: string;
//     Prospecção?: number;
//     'Análise documental'?: number;
//     'Revisão bancária'?: number;
//     'Assinatura de contrato'?: number;
//     'Liberação de crédito'?: number;
// }






export const Dashboard = () => {
    const { title } = useConfigurationContext();
    const theme = useTheme();
    const [dealsByStage, setDealsByStage] = useState<DealStageData[]>([]);
    const [contactCount, setContactCount] = useState(0);
    const [tasksDebug, setTasksDebug] = useState<any[]>([]);
    const [dealsDebug, setDealsDebug] = useState<any[]>([]);
    const [contactsDebug, setContactsDebug] = useState<any[]>([]);
    const [atividadesRecentes, setAtividadesRecentes] = useState<string[]>([]);


    useEffect(() => {
        dataProvider.getList('activities', {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'created_at', order: 'DESC' },
            filter: {},
        }).then(response => {
            const descricoes = response.data.map((item: any) => item.description);
            setAtividadesRecentes(descricoes);
        });
    }, []);



    useEffect(() => {
        dataProvider
            .getList('contacts', {
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'id', order: 'ASC' },
                filter: {},
            })
            .then((response) => {
                setContactCount(response.total ?? 0);
                setContactsDebug(response.data);
            });
    }, []);

    useEffect(() => {
        dataProvider.getList('deals', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'created_at', order: 'ASC' },
            filter: {},
        }).then(response => {
            const rawDeals = response.data;

            // Agrupamento por data e estágio
            const agrupado: { [date: string]: DealStageData } = {};

            rawDeals.forEach((deal: any) => {
                const date = new Date(deal.created_at).toLocaleDateString('pt-BR');

                if (!agrupado[date]) {
                    agrupado[date] = { date };
                }

                const stage = deal.stage;
                if (stage) {
                       agrupado[date][stage] = (Number(agrupado[date][stage]) || 0) + 1;

                }
            });

            const resultado = Object.values(agrupado);
            setDealsByStage(resultado);
        });
    }, []);


    useEffect(() => {
        dataProvider.getList('tasks', {
            pagination: { page: 1, perPage: 100 },
            sort: { field: 'due_date', order: 'ASC' },
            filter: {},
        }).then(response => {
            setTasksDebug(response.data);
        });
    }, []);


    const stats = [
        {
            label: 'Contatos',
            value: contactCount,
            icon: <ContactIcon />,
            color: theme.palette.primary.main,
        },
        {
            label: 'Negócios ativos',
            value: dealsDebug.length,
            icon: <DealsIcon />,
            color: theme.palette.secondary.main,
        },
        {
            label: 'Tarefas pendentes',
            value: tasksDebug.length,
            icon: <TasksIcon />,
            color: theme.palette.error.main,
        },
    ];



    return (
        <Box p={{ xs: 2, md: 4 }}>
            <Typography variant="h4" gutterBottom>
                👋 Bem-vindo à {title}
            </Typography>

            {/* KPIs com ícones */}
            <Grid container spacing={3}>
                {stats.map(({ label, value, icon, color }) => (
                    <Grid item xs={12} sm={6} md={4} key={label}>
                        <Card elevation={3} sx={{ borderRadius: 2 }}>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: color }}>{icon}</Avatar>}
                                title={label}
                            />
                            <CardContent>
                                <Typography variant="h4" fontWeight="bold" color="text.primary">
                                    {value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tarefas urgentes */}
            <Box mt={5}>
                <Typography variant="h6" gutterBottom>
                    📊 Negócios por Estágio
                </Typography>
                <Card elevation={3} sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dealsByStage}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Prospecção" stackId="a" fill="#2196f3" />
                                <Bar dataKey="Análise documental" stackId="a" fill="#4caf50" />
                                <Bar dataKey="Revisão bancária" stackId="a" fill="#ff9800" />
                                <Bar dataKey="Assinatura de contrato" stackId="a" fill="#9c27b0" />
                                <Bar dataKey="Liberação de crédito" stackId="a" fill="#f44336" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Box>

            {/* Atividades recentes */}
            <Box mt={5}>
                <Typography variant="h6" gutterBottom>
                    📌 Atividades Recentes
                </Typography>
                <Card elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <List>
                            {atividadesRecentes.map((atv, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText primary={atv} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Box>
            <Box mt={5}>
               
                <TaskAgenda />
            </Box>
        </Box>


    );
};
