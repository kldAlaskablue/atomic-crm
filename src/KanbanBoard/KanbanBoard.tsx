import { DndContext, DragEndEvent, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { dataProvider } from '../providers/supabase';
import styles from './Kanban.module.css';
import CardKanban from './CardKanban ';
import DroppableColumn from './DroppableColumn';

// ... (Interface Tarefa e const FASES)
interface Tarefa {
    id: string | number;
    lead_id: string;
    objetivo: string;
    due_date: string;
    responsavel: string;
    prioridade: string;
    status: string;
}
const FASES: string[] = ['Pendente', 'Em andamento', 'Concluído'];

// --- Componentes (versões revisadas) ---
const KanbanBoard = () => {
    const [tarefasPorFase, setTarefasPorFase] = useState<Record<string, Tarefa[]>>({});
    const [carregando, setCarregando] = useState(false);


    // MANTENHA OS CONSOLE.LOGS da etapa 1 aqui para depurar
    const carregarTarefas = async () => {
        setCarregando(true);
        try {
            const res = await dataProvider.getList('tasks', {
                pagination: { page: 1, perPage: 1000 },
                sort: { field: 'due_date', order: 'ASC' },
                filter: {},
            });

            const tarefas: Tarefa[] = res.data.map(t => ({ ...t, id: String(t.id) }));

            const agrupado: Record<string, Tarefa[]> = {};
            FASES.forEach(fase => (agrupado[fase] = []));
            tarefas.forEach(t => {
                const fase = FASES.includes(t.status) ? t.status : 'Pendente';
                agrupado[fase].push(t);
            });

            setTarefasPorFase(agrupado);
            console.log('Tarefas agrupadas:', agrupado);
        } catch (err) {
            console.error('Erro ao carregar tarefas:', err);
        } finally {
            setCarregando(false);
        }


    };
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

  // Validar se houve destino
  if (!over || active.id === over.id) return;

  // Buscar tarefa pelo ID
  const tarefaMovida = Object.values(tarefasPorFase)
    .flat()
    .find(t => String(t.id) === String(active.id));

  const novaFase = String(over.id); // ← representa a coluna (fase)
  if (!tarefaMovida || !FASES.includes(novaFase)) return;

  try {
    await dataProvider.update('tasks', {
      id: tarefaMovida.id,
      data: { status: novaFase },
      previousData: tarefaMovida,
    });

    // Recarregar tarefas após atualização
    carregarTarefas();
  } catch (err) {
    console.error('Erro ao mover tarefa:', err);
  }

     };

    useEffect(() => {
        carregarTarefas();
    }, []);

    return (
        <Box mt={4}>
            <Typography variant="h5" mb={3}>🗂️ Quadro Kanban</Typography>
            {carregando ? (
                <CircularProgress />
            ) : (
                <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                    <div className={styles.kanbanBoard}>
                        {FASES.map(fase => {
                            // Garantir que sempre temos um array, mesmo que vazio
                            const tasksDaFase = tarefasPorFase[fase] || [];
                            const taskIds = tasksDaFase.map(t => String(t.id));

                            return (
                                <DroppableColumn id={fase} key={fase} tarefas={tasksDaFase}>
                                    <SortableContext id={fase} items={taskIds} strategy={verticalListSortingStrategy}>
                                        {tasksDaFase.map(tarefa => (
                                            <CardKanban key={String(tarefa.id)} tarefa={tarefa} />
                                        ))}
                                    </SortableContext>
                                </DroppableColumn>
                            );
                        })}
                    </div>
                </DndContext>
            )}
        </Box>
    );
};

export default KanbanBoard;