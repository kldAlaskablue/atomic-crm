import { useDroppable } from '@dnd-kit/core';
import styles from './Kanban.module.css';

interface Tarefa {
  id: string | number;
  lead_id: string;
  objetivo: string;
  due_date: string;
  responsavel: string;
  prioridade: string;
  status: string;
}

const DroppableColumn = ({ id, children, tarefas }: { id: string; children: React.ReactNode; tarefas: Tarefa[] }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const columnClassName = `${styles.kanbanColumn} ${isOver ? styles.columnOver : ''}`;
  return (
    <div ref={setNodeRef} className={columnClassName}>
      <header className={styles.columnHeader}>
        <h3 className={styles.columnTitle}>{id}</h3>
        <span className={styles.taskCount}>{tarefas.length}</span>
      </header>
      <div className={styles.columnContent}>{children}</div>
    </div>
  );
};

export default DroppableColumn;