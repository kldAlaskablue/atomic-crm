import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, Chip } from '@mui/material';
import { useState } from 'react';
import { dataProvider } from '../providers/supabase';
import styles from './Kanban.module.css';

interface Tarefa {
  id: string | number;
  objetivo: string;
  responsavel: string;
  prioridade: string;
  status: string;
}

const CardKanban = ({ tarefa }: { tarefa: Tarefa }) => {
    const [carregando, setCarregando] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: String(tarefa.id) });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const getPriorityClass = (priority: string) => {
    const p = priority?.toLowerCase() || '';
    if (p.includes('alta')) return styles.priorityHigh;
    if (p.includes('media') || p.includes('média')) return styles.priorityMedium;
    return styles.priorityLow;
  };
  const cardClassName = `${styles.kanbanCard} ${isDragging ? styles.dragging : ''} ${getPriorityClass(tarefa.prioridade)}`;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={cardClassName}>
      <p className={styles.cardObjective}>{tarefa.objetivo || '📌 Sem objetivo'}</p>
      <div className={styles.cardFooter}>
        <span className={styles.cardResponsible}>{tarefa.responsavel || 'Não atribuído'}</span>
        <span className={`${styles.priorityChip} ${getPriorityClass(tarefa.prioridade)}`}>{tarefa.prioridade || 'Normal'}</span>
      </div>
    </div>
  );
};

export default CardKanban;