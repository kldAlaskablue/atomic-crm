import React from 'react'
import AdminTemplate from '../templates/AdminTemplate'
import AdminForm from '../organisms/AdminForm/AdminForm'
import ItemListEditor from '../organisms/ItemListEditor'
import SelectionPanel from '../organisms/SelectionPanel'

type Option = {
  id: string
  title: string
  description: string
  imageUrl: string
}

const AdminPage: React.FC = () => {
  const handleFormSubmit = (data: { [key: string]: string }) => {
    console.log('Formulário enviado:', data)
    // Integre com API ou CRM aqui
  }

  const handleListChange = (items: string[]) => {
    console.log('Itens atualizados:', items)
  }

  const handleSelectionChange = (selected: Option | null) => {
    console.log('Template selecionado:', selected)
  }

  return (
    <AdminTemplate title="Painel de Administração">
      <h2>Informações básicas</h2>
      <AdminForm onSubmit={handleFormSubmit} />

      <h2>Editor de Lista</h2>
      <ItemListEditor
        initialItems={['Item 1', 'Item 2']}
        onChange={handleListChange}
      />

      <h2>Selecionar Template</h2>
      <SelectionPanel
        options={[
          {
            id: 'blue',
            title: 'Azul',
            description: 'Estilo moderno',
            imageUrl: '/img/blue.png',
          },
          {
            id: 'green',
            title: 'Verde',
            description: 'Visual clean',
            imageUrl: '/img/green.png',
          },
          {
            id: 'orange',
            title: 'Laranja',
            description: 'Design vibrante',
            imageUrl: '/img/orange.png',
          },
        ]}
        multiple={false}
        onSelectionChange={handleSelectionChange}
      />
    </AdminTemplate>
  )
}

export default AdminPage