import React, { useState } from 'react'
import styles from './ItemListEditor.module.css'

interface ItemListEditorProps {
  initialItems?: string[]
  onChange?: (items: string[]) => void
}

const ItemListEditor: React.FC<ItemListEditorProps> = ({
  initialItems = [],
  onChange,
}) => {
  const [items, setItems] = useState<string[]>(initialItems)
  const [newItem, setNewItem] = useState('')

  const handleAdd = () => {
    if (newItem.trim() === '') return
    const updated = [...items, newItem.trim()]
    setItems(updated)
    onChange?.(updated)
    setNewItem('')
  }

  const handleDelete = (index: number) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
    onChange?.(updated)
  }

  const handleUpdate = (index: number, value: string) => {
    const updated = [...items]
    updated[index] = value
    setItems(updated)
    onChange?.(updated)
  }

  return (
    <div className={styles.container}>
      {items.map((item, index) => (
        <div key={index} className={styles.itemRow}>
          <input
            className={styles.input}
            value={item}
            onChange={(e) => handleUpdate(index, e.target.value)}
          />
          <button
            className={`${styles.button} ${styles.buttonDelete}`}
            onClick={() => handleDelete(index)}
          >
            Remover
          </button>
        </div>
      ))}
      <div className={styles.itemRow}>
        <input
          className={styles.input}
          placeholder="Novo item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          className={`${styles.button} ${styles.buttonAdd}`}
          onClick={handleAdd}
        >
          Adicionar
        </button>
      </div>
    </div>
  )
}

export default ItemListEditor