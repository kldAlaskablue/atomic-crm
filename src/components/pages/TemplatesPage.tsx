import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import AdminTemplate from '../templates/AdminTemplate';
import SelectionPanel from '../organisms/SelectionPanel';
import TemplateBuilder from '../templates/TemplateBuilder';

// Mapeia os IDs visuais para os tipos internos de templates
const idToTipo = {
    template1: 'capitalgiro',
    template2: 'imoveis',
    template3: 'agronegocio',
} as const;

type TemplateOption = {
    id: string
    title: string
    description: string
    imageUrl: string
}

type TemplateID = keyof typeof idToTipo;

const TemplatesPage = () => {
    const [selectedId, setSelectedId] = useState<TemplateID | null>(null);

    return (
        <AdminTemplate title="Selecionar Template">
            {/* Painel de seleção visual */}
            <SelectionPanel
                options={[
                    {
                        id: 'template1',
                        title: 'Template Azul',
                        description: 'Moderno e elegante',
                        imageUrl: '/img/blue.png',
                    },
                    {
                        id: 'template2',
                        title: 'Template Verde',
                        description: 'Clean e leve',
                        imageUrl: '/img/green.png',
                    },
                    {
                        id: 'template3',
                        title: 'Template Laranja',
                        description: 'Estilo vibrante',
                        imageUrl: '/img/orange.png',
                    },
                ]}
                multiple={false}
                onSelectionChange={(selected: TemplateOption | null) => {
                    const id = selected?.id
                    if (id && id in idToTipo) {
                        setSelectedId(id as TemplateID)
                    } else {
                        setSelectedId(null)
                    }
                }}


            />

            {/* Painel de edição e preview dinâmico */}
            {selectedId && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Template Selecionado: {idToTipo[selectedId]}
                    </Typography>

                    <TemplateBuilder tipo={idToTipo[selectedId]} />
                </Box>
            )}
        </AdminTemplate>
    );
};

export default TemplatesPage;
