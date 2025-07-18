import { CRM } from './root/CRM';
import { useConfigurationContext } from './root/ConfigurationContext';

const App = () => {
    const { dealStages, taskTypes } = useConfigurationContext();

    return (
        <CRM
            title="Alaska Blue CRM"
            logo="./logos/Alaska_Blue_Branco_L_tp.png"
            lightTheme={{
                palette: {
                    mode: 'light',
                    primary: { main: '#012A52' },
                    secondary: { main: '#D4AF37' },
                    background: { default: '#F5F5F5' },
                    text: { primary: '#333333' },
                },
            }}
            darkTheme={{
                palette: {
                    mode: 'dark',
                    primary: { main: '#012A52' },
                    secondary: { main: '#D4AF37' },
                },
            }}
            companySectors={['Clientes PF', 'Clientes PJ', 'Instituições Bancárias']}
            dealCategories={['Empréstimo com garantia', 'Refinanciamento', 'Consignado', 'Parceria bancária']}
            dealStages={[
                { value: 'prospect', label: 'Prospecção' },
                { value: 'document-analysis', label: 'Análise documental' },
                { value: 'bank-review', label: 'Revisão bancária' },
                { value: 'contract-sign', label: 'Assinatura de contrato' },
                { value: 'fund-disbursed', label: 'Liberação de crédito' },
            ]}
            taskTypes={['Ligação', 'WhatsApp', 'Consulta de crédito', 'Envio de documentos', 'Reunião']}
            noteStatuses={[
                { value: 'cold', label: 'Frio', color: '#B0C4DE' },
                { value: 'warm', label: 'Morno', color: '#FFD700' },
                { value: 'hot', label: 'Quente', color: '#DC143C' },
                { value: 'urgent', label: 'Urgente', color: '#FF4500' },
            ]}
        />
    );
};

export default App;
