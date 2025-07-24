// src/components/2-molecules/SelectGroup/SelectGroup.tsx
import React from 'react'
import styles from './SelectGroup.module.css'

interface SelectGroupProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

const SelectGroup: React.FC<SelectGroupProps> = ({ label, options, value, onChange }) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectGroup