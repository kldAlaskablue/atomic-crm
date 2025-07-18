import UploadIcon from '@mui/icons-material/Upload';
import { useState } from 'react';
import { ContactImportDialog } from './ContactImportDialog';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

export const ContactImportButton = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
           <Button startIcon={<SendIcon />}>Enviar</Button>
            <ContactImportDialog open={modalOpen} onClose={handleCloseModal} />
        </>
    );
};
