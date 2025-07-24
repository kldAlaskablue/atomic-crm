export interface BenefitItem {
  icon: string
  text: string
}

export interface Benefits {
  id: number
  tipo: string
  title: string
  subtitle: string
  itens?: BenefitItem[]
}