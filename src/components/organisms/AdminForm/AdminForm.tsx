// src/components/3-organisms/AdminForm/AdminForm.tsx
import React from 'react'
import FieldGroup from '../../molecules/FieldGroup/FieldGroup'
import SelectGroup from '../../molecules/SelectGroup/SelectGroup'
import { Button } from '../../atoms/Button/Button'

interface AdminFormProps {
    onSubmit: (formData: { [key: string]: string }) => void
}

const AdminForm: React.FC<AdminFormProps> = ({ onSubmit }) => {
    const [formState, setFormState] = React.useState({
        name: '',
        role: '',
    })

    const handleChange = (field: string, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formState)
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup
                label="Nome"
                value={formState.name}
                onChange={(value) => handleChange('name', value)}
                as="input" // ou "textarea" se quiser texto maior
            />

            <SelectGroup
                label="Função"
                options={['Admin', 'Editor', 'Viewer']}
                value={formState.role}
                onChange={(value) => handleChange('role', value)}
            />
            <Button type="submit">Salvar</Button>
        </form>
    )
}

export default AdminForm