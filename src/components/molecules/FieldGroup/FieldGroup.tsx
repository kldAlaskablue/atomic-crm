import React, { ChangeEvent } from 'react'
import styles from './FieldGroup.module.css'

interface FieldGroupProps {
  label: string
  value: string
  onChange: (value: string) => void
  as?: 'input' | 'textarea'
}

const FieldGroup: React.FC<FieldGroupProps> = ({ label, value, onChange, as = 'input' }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      {as === 'textarea' ? (
        <textarea className={styles.input} value={value} onChange={handleChange} />
      ) : (
        <input className={styles.input} value={value} onChange={handleChange} />
      )}
    </div>
  )
}

export default FieldGroup