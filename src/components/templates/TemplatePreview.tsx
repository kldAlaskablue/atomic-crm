import { HeroSectionDB, AboutSectionDB, BenefitsSectionDB, WhyUsSectionDB, garantiasDB } from '../data/templatesMock'
import HeroSectionView from './Sections/HeroSectionView'
import AboutSectionView from './Sections/AboutSectionView'
import BenefitsSectionView from './Sections/BenefitsSectionView'
import WhyUsSectionView from './Sections/WhyUsSectionView'
import GuaranteesView from './Sections/GuaranteesView'

const TemplatePreview = ({ tipo }: { tipo: string }) => {
  const hero = HeroSectionDB[tipo]
  const about = AboutSectionDB[tipo]
  const benefits = BenefitsSectionDB[tipo]
  const whyus = WhyUsSectionDB[tipo]
  const garantias = garantiasDB[tipo]

  return (
    <div style={{ padding: '2rem' }}>
      <HeroSectionView data={hero} />
      <AboutSectionView data={about} />
      <BenefitsSectionView data={benefits} />
      <WhyUsSectionView data={whyus} />
      <GuaranteesView data={garantias} />
    </div>
  )
}

export default TemplatePreview