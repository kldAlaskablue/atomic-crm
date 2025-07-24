import { HeroSection } from '../models/hero/heroSection'
import { About } from '../models/about/about'
import { Benefits } from '../models/benefits/benefits'
import { WhyUsContext } from '../models/WhyUs/WhyUs'
import { GuaranteesL } from '../models/Guarantees/Guarantees'

// HERO
export const HeroSectionDB: Record<string, HeroSection> = {
  capitalgiro: {
    id: 2,
    tipo: 'capitalgiro',
    titulo: 'Capital de Giro Inteligente para sua Empresa Crescer',
    subtitulo: 'A Alaska Blue conecta seu negócio a fundos de private equity, garantindo os recursos essenciais para impulsionar suas operações com agilidade e segurança.',
    subtituloMenor: '',
    layout: 'center',
    corFundo: '#007fff',
    mostrarBotao: true,
    mostrarLink: true,
    usarCarrossel: false,
    ImagemFundo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg',
    Imagemdestaque: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    showImage: true,
    showImagemFundo: true,
    textLinkbotao: 'Descubra',
    status: true
  }
}

// ABOUT
export const AboutSectionDB: Record<string, About> = {
  capitalgiro: {
    id: 1,
    tipo: 'capitalgiro',
    title: 'O que são Private Equity Funds para Capital de Giro?',
    description: 'Esses fundos direcionam investimentos para viabilizar a continuidade, a eficiência e o crescimento dos negócios.',
    itens: [
      { title: 'Reforço de capital', description: 'Para empresas de variados portes e segmentos.' },
      { title: 'Financiamento de estoques', description: 'Compras de insumos e matérias-primas.' },
      { title: 'Cobertura de despesas', description: 'Apoio em sazonalidades e despesas operacionais.' },
      { title: 'Resposta rápida ao mercado', description: 'Para novas demandas ou desafios conjunturais.' }
    ]
  }
}

// BENEFITS
export const BenefitsSectionDB: Record<string, Benefits> = {
  capitalgiro: {
    id: 1,
    tipo: 'capitalgiro',
    title: 'Benefícios para sua Empresa',
    subtitle: 'A parceria com a Alaska Blue abre portas para um crescimento sustentável e seguro.',
    itens: [
      { icon: 'BarChart', text: 'Solidez para enfrentar desafios de curto e médio prazo.' },
      { icon: 'Users', text: 'Flexibilidade para administrar estoques, fornecedores e clientes.' },
      { icon: 'CheckCircle2', text: 'Aumento de liquidez e preparo para expansão.' },
      { icon: 'Briefcase', text: 'Otimização dos fluxos de caixa e redução de riscos financeiros.' }
    ]
  }
}

// WHY US
export const WhyUsSectionDB: Record<string, WhyUsContext> = {
  capitalgiro: {
    id: 1,
    tipo: 'capitalgiro',
    title: 'Por que escolher a Alaska Blue?',
    subtitle: 'Com a Alaska Blue, o acesso ao capital de giro é facilitado, seguro e estratégico.',
    itens: [
      { icon: 'CheckCircle2', text: 'Experiência em investimentos estruturados e soluções financeiras ágeis.' },
      { icon: 'CheckCircle2', text: 'Abordagem consultiva e atendimento próximo e personalizado.' },
      { icon: 'CheckCircle2', text: 'Rede robusta de fundos e investidores especializados em capital de giro.' },
      { icon: 'CheckCircle2', text: 'Compromisso com resultados, ética e total transparência.' }
    ]
  }
}

// GARANTIAS
export const garantiasDB: Record<string, GuaranteesL> = {
  capitalgiro: {
    id: 1,
    tipo: 'capitalgiro',
    titulo: '',
    subtitulo: '',
    itens: [
      { icon: 'BarChart', name: 'Solidez para enfrentar desafios de curto e médio prazo.' },
      { icon: 'Users', name: 'Flexibilidade para administrar estoques, fornecedores e clientes.' },
      { icon: 'CheckCircle2', name: 'Aumento de liquidez e preparo para expansão.' },
      { icon: 'Briefcase', name: 'Otimização dos fluxos de caixa e redução de riscos financeiros.' }
    ]
  }
}